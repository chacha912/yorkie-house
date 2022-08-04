import Long from 'long';
import { Document } from 'yorkie-js-sdk';
import { AdminPromiseClient } from './admin_grpc_web_pb';
import {
  LogInRequest,
  SignUpRequest,
  ListProjectsRequest,
  ListDocumentsRequest,
  GetProjectRequest,
  GetDocumentRequest,
  CreateProjectRequest,
  UpdateProjectRequest,
  SearchDocumentsRequest,
  ListChangesRequest,
  GetSnapshotMetaRequest,
} from './admin_pb';
import * as errorDetails from 'grpc-web-error-details';

import { AuthUnaryInterceptor, AuthStreamInterceptor } from './auth_interceptor';
import { UpdatableProjectFields as PbProjectFields } from './resources_pb';
import * as PbWrappers from 'google-protobuf/google/protobuf/wrappers_pb';

import { User, Project, DocumentSummary, UpdatableProjectFields, DocumentHistory } from './types';
import * as converter from './converter';

export * from './types';

// TODO(hackerwins): Consider combining these two interceptors into one.
const unaryInterceptor = new AuthUnaryInterceptor();
const streamInterceptor = new AuthStreamInterceptor();
const client = new AdminPromiseClient(`${process.env.REACT_APP_ADMIN_ADDR}`, null, {
  unaryInterceptors: [unaryInterceptor],
  streamInterceptors: [streamInterceptor],
});

// setToken sets the token for the current user.
export function setToken(token: string) {
  unaryInterceptor.setToken(token);
  streamInterceptor.setToken(token);
}

// logIn logs in the user and returns a token.
export async function logIn(username: string, password: string): Promise<string> {
  const req = new LogInRequest();
  req.setUsername(username);
  req.setPassword(password);
  const res = await client.logIn(req);
  const token = res.getToken();
  setToken(token);
  return token;
}

// signUp signs up the user and returns a user.
export async function signUp(username: string, password: string): Promise<User> {
  const req = new SignUpRequest();
  req.setUsername(username);
  req.setPassword(password);
  const res = await client.signUp(req);
  return converter.fromUser(res.getUser()!);
}

// createProject creates a new project.
export async function createProject(name: string): Promise<Project> {
  const req = new CreateProjectRequest();
  req.setName(name);
  const res = await client.createProject(req);
  return converter.fromProject(res.getProject()!);
}

// listProjects fetches projects from the admin server.
export async function listProjects(): Promise<Array<Project>> {
  const req = new ListProjectsRequest();
  const res = await client.listProjects(req);
  return converter.fromProjects(res.getProjectsList());
}

// getProject fetch project from the admin server.
export async function getProject(name: string): Promise<Project> {
  const req = new GetProjectRequest();
  req.setName(name);
  const res = await client.getProject(req);
  return converter.fromProject(res.getProject()!);
}

// UpdateProject updates a project info.
export async function updateProject(id: string, fields: UpdatableProjectFields): Promise<Project> {
  const req = new UpdateProjectRequest();
  req.setId(id);
  const pbFields = new PbProjectFields();
  if (fields.name) {
    const name = new PbWrappers.StringValue().setValue(fields.name);
    pbFields.setName(name);
  }
  if (fields.authWebhookURL !== undefined) {
    const authWebhookURL = new PbWrappers.StringValue().setValue(fields.authWebhookURL);
    pbFields.setAuthWebhookUrl(authWebhookURL);
  }
  if (fields.authWebhookMethods) {
    const authWebhookMethods = new PbProjectFields.AuthWebhookMethods().setMethodsList(fields.authWebhookMethods);
    pbFields.setAuthWebhookMethods(authWebhookMethods);
  }

  req.setFields(pbFields);
  try {
    const res = await client.updateProject(req);
    return converter.fromProject(res.getProject()!);
  } catch (error) {
    const [status, details] = errorDetails.statusFromError(error);
    if (!status || !details) {
      throw error;
    }

    throw converter.toErrorWithDetails(status, details);
  }
}

// listDocuments fetches documents from the admin server.
export async function listDocuments(
  projectName: string,
  previousID: string,
  pageSize: number,
  isForward: boolean,
): Promise<Array<DocumentSummary>> {
  const req = new ListDocumentsRequest();
  req.setProjectName(projectName);
  req.setPreviousId(previousID);
  req.setPageSize(pageSize);
  req.setIsForward(isForward);
  const res = await client.listDocuments(req);
  const summaries = converter.fromDocumentSummaries(res.getDocumentsList());
  if (isForward) {
    summaries.reverse();
  }
  return summaries;
}

// getDocument fetches a document of the given ID from the admin server.
export async function getDocument(projectName: string, documentKey: string): Promise<DocumentSummary> {
  const req = new GetDocumentRequest();
  req.setProjectName(projectName);
  req.setDocumentKey(documentKey);
  const res = await client.getDocument(req);

  const document = res.getDocument();
  return converter.fromDocumentSummary(document!);
}

// searchDocuments fetches documents that match the query parameters.
export async function searchDocuments(
  projectName: string,
  documentQuery: string,
  pageSize: number,
): Promise<{
  totalCount: number;
  documents: Array<DocumentSummary>;
}> {
  const req = new SearchDocumentsRequest();
  req.setProjectName(projectName);
  req.setQuery(documentQuery);
  req.setPageSize(pageSize);
  const res = await client.searchDocuments(req);
  const summaries = converter.fromDocumentSummaries(res.getDocumentsList());
  return {
    totalCount: res.getTotalCount(),
    documents: summaries,
  };
}

// listDocumentHistories lists of changes for the given document.
export async function listDocumentHistories(
  projectName: string,
  documentKey: string,
  previousSeq: string,
  pageSize: number,
  isForward: boolean,
): Promise<Array<DocumentHistory>> {
  const req = new ListChangesRequest();
  req.setProjectName(projectName);
  req.setDocumentKey(documentKey);
  req.setPreviousSeq(previousSeq);
  req.setPageSize(pageSize);
  req.setIsForward(isForward);
  const response = await client.listChanges(req);
  const pbChanges = response.getChangesList();
  const changes = converter.fromChanges(pbChanges);

  const seq = Long.fromString(pbChanges[0].getId()!.getServerSeq()).add(-1);
  const metaReq = new GetSnapshotMetaRequest();
  metaReq.setProjectName(projectName);
  metaReq.setDocumentKey(documentKey);
  metaReq.setServerSeq(seq.toString());
  const snapshotMeta = await client.getSnapshotMeta(metaReq);

  const document = new Document(documentKey);
  document.applySnapshot(seq, snapshotMeta.getSnapshot() as any);

  const histories: Array<DocumentHistory> = [];
  for (let i = 0; i < changes.length; i++) {
    document.applyChanges([changes[i]]);
    histories.push({
      serverSeq: pbChanges[i].getId()!.getServerSeq(),
      snapshot: document.toJSON(),
    });
  }
  return histories;
}
