/*
 * Copyright 2022 The Yorkie Authors. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react';
import { NavLink as Link, useParams } from 'react-router-dom';
import { useAppDispatch } from 'app/hooks';
import { getProjectAsync } from './projectsSlice';

export function ProjectMenu() {
  let { projectName } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!projectName) {
      return;
    }

    dispatch(getProjectAsync(projectName));
  }, [dispatch, projectName]);

  const itemStyle =
    'inline-flex items-center p-2 rounded-t-lg border-b-2 border-solid border-transparent hover:text-gray-600 hover:border-gray-300';
  const activeStyle = '!text-gray-800 !border-orange-500';

  return (
    <>
      <div className="border-b border-solid border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="inline-flex">
            <h2 className="text-lg font-semibold">
              <Link to="/projects">{projectName}</Link>
            </h2>
          </div>
        </div>
        <ul className="flex flex-wrap -mb-px text-xs font-medium text-center text-gray-500">
          <li className="mr-2">
            <Link
              to={`/projects/${projectName}`}
              className={({ isActive }) => (isActive ? `${itemStyle} ${activeStyle}` : itemStyle)}
              end
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.98769 2.00515C6.92939 2.00039 6.84827 2 6.7 2H5.3C5.15174 2 5.07061 2.00039 5.01232 2.00515C5.01 2.00534 5.0078 2.00554 5.00573 2.00573C5.00554 2.0078 5.00534 2.01 5.00515 2.01232C5.00039 2.07061 5 2.15174 5 2.3V3.49947C5 3.49965 5 3.49983 5 3.5C5 3.50018 5 3.50036 5 3.50053V10H7V2.3C7 2.15174 6.99961 2.07061 6.99485 2.01232C6.99466 2.01 6.99447 2.0078 6.99428 2.00573C6.9922 2.00554 6.99001 2.00534 6.98769 2.00515ZM8 5L8 2.28405C8.00002 2.15786 8.00003 2.03496 7.99153 1.93089C7.98219 1.81659 7.96016 1.68172 7.89101 1.54601C7.79514 1.35785 7.64215 1.20487 7.45399 1.109C7.31828 1.03985 7.18341 1.01781 7.06912 1.00848C6.96504 0.999972 6.84214 0.999986 6.71595 1L5.28405 1C5.15786 0.999986 5.03497 0.999972 4.93089 1.00848C4.81659 1.01781 4.68172 1.03985 4.54601 1.109C4.35785 1.20487 4.20487 1.35785 4.109 1.54601C4.03985 1.68172 4.01781 1.81659 4.00848 1.93089C3.99997 2.03497 3.99999 2.15786 4 2.28405C4 2.28936 4 2.29468 4 2.3V3H2.3C2.29468 3 2.28936 3 2.28405 3C2.15786 2.99999 2.03497 2.99997 1.93089 3.00848C1.81659 3.01781 1.68172 3.03985 1.54601 3.109C1.35785 3.20487 1.20487 3.35785 1.109 3.54601C1.03985 3.68172 1.01781 3.81659 1.00848 3.93089C0.999972 4.03497 0.999986 4.15786 1 4.28405C1 4.28937 1 4.29468 1 4.3L1 9.71595C0.999986 9.84214 0.999972 9.96504 1.00848 10.0691C1.01781 10.1834 1.03985 10.3183 1.109 10.454C1.20487 10.6422 1.35785 10.7951 1.54601 10.891C1.68172 10.9602 1.81659 10.9822 1.93089 10.9915C2.03496 11 2.15786 11 2.28404 11H9.71596C9.84215 11 9.96504 11 10.0691 10.9915C10.1834 10.9822 10.3183 10.9602 10.454 10.891C10.6422 10.7951 10.7951 10.6422 10.891 10.454C10.9602 10.3183 10.9822 10.1834 10.9915 10.0691C11 9.96504 11 9.84215 11 9.71596V6.28404C11 6.15786 11 6.03496 10.9915 5.93089C10.9822 5.81659 10.9602 5.68172 10.891 5.54601C10.7951 5.35785 10.6422 5.20487 10.454 5.109C10.3183 5.03985 10.1834 5.01781 10.0691 5.00848C9.96504 4.99997 9.84214 4.99999 9.71595 5L8 5ZM8 6V10H9.7C9.84827 10 9.92939 9.99961 9.98769 9.99485C9.99001 9.99466 9.9922 9.99447 9.99428 9.99427C9.99447 9.9922 9.99466 9.99001 9.99485 9.98769C9.99961 9.92939 10 9.84827 10 9.7V6.3C10 6.15174 9.99961 6.07061 9.99485 6.01232C9.99466 6.01 9.99447 6.0078 9.99427 6.00573C9.9922 6.00554 9.99001 6.00534 9.98769 6.00515C9.92939 6.00039 9.84827 6 9.7 6H8ZM4 4H2.3C2.15174 4 2.07061 4.00039 2.01232 4.00515C2.01 4.00534 2.0078 4.00554 2.00573 4.00573C2.00554 4.0078 2.00534 4.01 2.00515 4.01232C2.00039 4.07061 2 4.15174 2 4.3V9.7C2 9.84827 2.00039 9.92939 2.00515 9.98769C2.00534 9.99001 2.00554 9.9922 2.00573 9.99427C2.0078 9.99447 2.01 9.99466 2.01232 9.99485C2.07061 9.99961 2.15174 10 2.3 10H4L4 4ZM1.54601 10.891C1.54601 10.891 1.54601 10.891 1.54601 10.891Z"
                  fill="#807B78"
                />
              </svg>
              <span className="ml-3">Project overview</span>
            </Link>
          </li>
          <li className="mr-2">
            <Link
              to={`/projects/${projectName}/documents`}
              className={({ isActive }) => (isActive ? `${itemStyle} ${activeStyle}` : itemStyle)}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 0.5C6.27614 0.5 6.5 0.723858 6.5 1V1.5L9.41927 1.5C9.68285 1.49999 9.91023 1.49998 10.0975 1.51528C10.2952 1.53144 10.4918 1.56709 10.681 1.66349C10.9632 1.8073 11.1927 2.03677 11.3365 2.31901C11.4329 2.5082 11.4686 2.70481 11.4847 2.90249C11.5 3.08977 11.5 3.31715 11.5 3.58072V6.91928C11.5 7.18285 11.5 7.41023 11.4847 7.59751C11.4686 7.79519 11.4329 7.9918 11.3365 8.18099C11.1927 8.46323 10.9632 8.6927 10.681 8.83651C10.4918 8.93291 10.2952 8.96856 10.0975 8.98472C9.91023 9.00002 9.68285 9.00001 9.41928 9H8.70711L10.3536 10.6464C10.5488 10.8417 10.5488 11.1583 10.3536 11.3536C10.1583 11.5488 9.84171 11.5488 9.64645 11.3536L7.29289 9H6.5V11C6.5 11.2761 6.27614 11.5 6 11.5C5.72386 11.5 5.5 11.2761 5.5 11V9H4.70711L2.35355 11.3536C2.15829 11.5488 1.84171 11.5488 1.64645 11.3536C1.45119 11.1583 1.45119 10.8417 1.64645 10.6464L3.29289 9H2.58072C2.31715 9.00001 2.08977 9.00002 1.90249 8.98472C1.70481 8.96856 1.5082 8.93291 1.31902 8.83651C1.03677 8.6927 0.807301 8.46323 0.663491 8.18099C0.567094 7.9918 0.531436 7.79519 0.515286 7.59751C0.499984 7.41023 0.499991 7.18285 0.5 6.91927V3.58073C0.499991 3.31715 0.499984 3.08977 0.515286 2.90249C0.531436 2.70481 0.567094 2.5082 0.663491 2.31901C0.807301 2.03677 1.03677 1.8073 1.31902 1.66349C1.5082 1.56709 1.70481 1.53144 1.90249 1.51528C2.08977 1.49998 2.31716 1.49999 2.58073 1.5L5.5 1.5V1C5.5 0.723858 5.72386 0.5 6 0.5ZM2.6 2.5C2.31172 2.5 2.12559 2.50039 1.98392 2.51196C1.84809 2.52306 1.79773 2.5419 1.77301 2.5545C1.67892 2.60243 1.60243 2.67892 1.5545 2.773C1.5419 2.79773 1.52306 2.84809 1.51196 2.98392C1.50039 3.12559 1.5 3.31172 1.5 3.6V6.9C1.5 7.18828 1.50039 7.37441 1.51196 7.51608C1.52306 7.65191 1.5419 7.70227 1.5545 7.72699C1.60243 7.82108 1.67892 7.89757 1.77301 7.9455C1.79773 7.9581 1.84809 7.97694 1.98392 7.98804C2.12559 7.99961 2.31172 8 2.6 8H4.49965C4.49989 8 4.50012 8 4.50035 8H7.49965C7.49989 8 7.50012 8 7.50035 8H9.4C9.68828 8 9.87441 7.99961 10.0161 7.98804C10.1519 7.97694 10.2023 7.9581 10.227 7.9455C10.3211 7.89757 10.3976 7.82108 10.4455 7.72699C10.4581 7.70227 10.4769 7.65191 10.488 7.51608C10.4996 7.37441 10.5 7.18828 10.5 6.9V3.6C10.5 3.31172 10.4996 3.12559 10.488 2.98392C10.4769 2.84809 10.4581 2.79773 10.4455 2.773C10.3976 2.67892 10.3211 2.60243 10.227 2.5545C10.2023 2.5419 10.1519 2.52306 10.0161 2.51196C9.87441 2.50039 9.68828 2.5 9.4 2.5H2.6Z"
                  fill="#514C49"
                />
              </svg>
              <span className="ml-3">Documents</span>
            </Link>
          </li>
          <li className="mr-2">
            <Link
              to={`/projects/${projectName}/apikeys`}
              className={({ isActive }) => (isActive ? `${itemStyle} ${activeStyle}` : itemStyle)}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.0001 4.5C4.0001 2.567 5.5671 1 7.5001 1C9.43309 1 11.0001 2.567 11.0001 4.5C11.0001 6.433 9.43309 8 7.5001 8C7.34091 8 7.18396 7.98934 7.02996 7.96864C6.91746 7.95351 6.84705 7.94413 6.79574 7.93918C6.78659 7.93829 6.77908 7.93767 6.77303 7.93723C6.77152 7.93857 6.76988 7.94005 6.7681 7.94167C6.74135 7.96603 6.70618 8.00103 6.64322 8.06399L5.85365 8.85355C5.75988 8.94732 5.6327 9 5.5001 9H5.0001V9.5C5.0001 9.77614 4.77624 10 4.5001 10H4.0001V10.5C4.0001 10.7761 3.77624 11 3.5001 11L2.28414 11C2.15795 11 2.03506 11 1.93098 10.9915C1.81668 10.9822 1.68182 10.9602 1.54611 10.891C1.35794 10.7951 1.20496 10.6422 1.10909 10.454C1.03994 10.3183 1.01791 10.1834 1.00857 10.0691C1.00006 9.96504 1.00008 9.84214 1.00009 9.71595L1.0001 8.83137C1.0001 8.82309 1.00007 8.81457 1.00005 8.80585C0.999796 8.7109 0.999477 8.59133 1.02773 8.47366C1.05222 8.37162 1.09263 8.27408 1.14746 8.18461C1.21068 8.08143 1.29546 7.99711 1.36278 7.93014C1.36896 7.92399 1.375 7.91799 1.38086 7.91213L3.93611 5.35688C3.99907 5.29392 4.03407 5.25874 4.05842 5.232C4.06004 5.23022 4.06152 5.22858 4.06287 5.22707C4.06243 5.22102 4.0618 5.21351 4.06092 5.20436C4.05596 5.15304 4.04658 5.08264 4.03146 4.97014C4.01075 4.81614 4.0001 4.65918 4.0001 4.5ZM4.0001 9V8.5C4.0001 8.22386 4.22395 8 4.5001 8H5.29299L5.93611 7.35688C5.94464 7.34834 5.95338 7.33956 5.9623 7.33057C6.05193 7.24037 6.16094 7.13066 6.28519 7.06121C6.4019 6.99597 6.49915 6.96311 6.6315 6.94418C6.72821 6.93035 6.82236 6.9371 6.89184 6.94381C6.96411 6.95078 7.05339 6.96279 7.15431 6.97636L7.1632 6.97755C7.27316 6.99234 7.3856 7 7.5001 7C8.88081 7 10.0001 5.88071 10.0001 4.5C10.0001 3.11929 8.88081 2 7.5001 2C6.11938 2 5.0001 3.11929 5.0001 4.5C5.0001 4.6145 5.00776 4.72694 5.02254 4.8369L5.02374 4.8458C5.03731 4.94672 5.04931 5.03599 5.05629 5.10826C5.063 5.17773 5.06975 5.27189 5.05592 5.36859C5.03698 5.50095 5.00412 5.59819 4.93889 5.7149C4.86944 5.83916 4.75972 5.94817 4.66952 6.0378C4.66054 6.04672 4.65175 6.05545 4.64322 6.06399L2.08796 8.61924C2.04165 8.66555 2.01862 8.68876 2.00259 8.70631C2.00217 8.70677 2.00177 8.70722 2.00139 8.70764C2.00136 8.70821 2.00133 8.70881 2.0013 8.70943C2.00021 8.73318 2.0001 8.76587 2.0001 8.83137V9.7C2.0001 9.84826 2.00048 9.92939 2.00525 9.98768C2.00544 9.99 2.00563 9.9922 2.00582 9.99427C2.00789 9.99446 2.01009 9.99466 2.01241 9.99485C2.0707 9.99961 2.15183 10 2.3001 10H3.0001V9.5C3.0001 9.22386 3.22395 9 3.5001 9H4.0001ZM7.0001 3.5C7.0001 3.22386 7.22395 3 7.5001 3C7.8832 3 8.26796 3.14654 8.56076 3.43934C8.85354 3.73212 9.00008 4.11686 9.0001 4.49996C9.0001 4.7761 8.77625 4.99996 8.50011 4.99997C8.22397 4.99998 8.0001 4.77613 8.0001 4.49999C8.00009 4.37126 7.95137 4.24417 7.85365 4.14645C7.75592 4.04872 7.62883 4 7.5001 4C7.22395 4 7.0001 3.77614 7.0001 3.5Z"
                  fill="#A6A19E"
                />
              </svg>
              <span className="ml-3">API</span>
            </Link>
          </li>
          <li className="mr-2">
            <Link
              to={`/projects/${projectName}/settings`}
              className={({ isActive }) => (isActive ? `${itemStyle} ${activeStyle}` : itemStyle)}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.209 1.82178C4.71202 0.0594081 7.20964 0.0594076 7.71266 1.82178C7.83446 2.24852 8.27289 2.50165 8.70336 2.39376C10.4811 1.94821 11.7299 4.1112 10.4552 5.42802C10.1465 5.74687 10.1465 6.25313 10.4552 6.57198C11.7299 7.8888 10.4811 10.0518 8.70336 9.60624C8.27289 9.49836 7.83446 9.75148 7.71266 10.1782C7.20964 11.9406 4.71202 11.9406 4.209 10.1782C4.0872 9.75148 3.64877 9.49836 3.2183 9.60624C1.44053 10.0518 0.191722 7.8888 1.46647 6.57198C1.77514 6.25313 1.77514 5.74687 1.46647 5.42802C0.191722 4.1112 1.44053 1.94821 3.2183 2.39376C3.64877 2.50165 4.0872 2.24852 4.209 1.82178ZM6.75161 2.09608C6.52454 1.30055 5.39711 1.30055 5.17005 2.09608C4.90022 3.04146 3.92896 3.60221 2.97533 3.36321C2.17284 3.16208 1.60913 4.13846 2.18455 4.73288C2.86835 5.43925 2.86835 6.56075 2.18455 7.26712C1.60913 7.86154 2.17284 8.83792 2.97533 8.6368C3.92896 8.39779 4.90022 8.95854 5.17005 9.90392C5.39711 10.6995 6.52454 10.6995 6.75161 9.90392C7.02144 8.95854 7.99269 8.39779 8.94633 8.6368C9.74882 8.83792 10.3125 7.86154 9.73711 7.26712C9.05331 6.56075 9.05331 5.43925 9.73711 4.73288C10.3125 4.13846 9.74882 3.16208 8.94633 3.36321C7.9927 3.60221 7.02144 3.04146 6.75161 2.09608Z"
                  fill="#A6A19E"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.9598 5.00041C5.40783 5.00041 4.96037 5.44787 4.96037 5.99984C4.96037 6.55181 5.40783 6.99927 5.9598 6.99927C6.51177 6.99927 6.95923 6.55181 6.95923 5.99984C6.95923 5.44787 6.51177 5.00041 5.9598 5.00041ZM3.96094 5.99984C3.96094 4.8959 4.85586 4.00098 5.9598 4.00098C7.06374 4.00098 7.95866 4.8959 7.95866 5.99984C7.95866 7.10378 7.06374 7.9987 5.9598 7.9987C4.85586 7.9987 3.96094 7.10378 3.96094 5.99984Z"
                  fill="#A6A19E"
                />
              </svg>
              <span className="ml-3">Settings</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
