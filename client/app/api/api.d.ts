/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/api/tasks": {
    post: operations["postAddTask"];
  };
  "/api/tasks/current/resume": {
    post: operations["postResumeCurrentTask"];
  };
  "/api/tasks/current/pause": {
    post: operations["postPauseCurrentTask"];
  };
  "/api/tasks/current/end": {
    post: operations["postEndCurrentTask"];
  };
  "/api/tasks/current/create": {
    post: operations["postCreateCurrentTask"];
  };
  "/api/categories": {
    post: operations["postCreateCategory"];
  };
  "/api/tasks/{id}": {
    delete: operations["deleteTask"];
    patch: operations["patchUpdateTask"];
  };
  "/api/categories/{id}": {
    delete: operations["deleteCategory"];
    patch: operations["patchUpdateCategory"];
  };
  "/api/tasks/current": {
    get: operations["getCurrentTask"];
  };
  "/api/tasks/all": {
    get: operations["getAllTasks"];
  };
  "/api/overviews/yearly": {
    get: operations["getYearlyOverview"];
  };
  "/api/overviews/weekly": {
    get: operations["getWeeklyOverview"];
  };
  "/api/overviews/daily": {
    get: operations["getDailyOverview"];
  };
  "/api/categories/all": {
    get: operations["getAllCategories"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    ProblemDetail: {
      /** Format: uri */
      type?: string;
      title?: string;
      /** Format: int32 */
      status?: number;
      detail?: string;
      /** Format: uri */
      instance?: string;
      properties?: {
        [key: string]: Record<string, never>;
      };
    };
    AddTaskDto: {
      name: string;
      categoryId: string;
      /** Format: int64 */
      duration: number;
      /** Format: date-time */
      startTime: string;
      /** Format: date-time */
      endTime: string;
    };
    CreateCurrentTaskDto: {
      name: string;
      categoryId: string;
      /** Format: int64 */
      duration: number;
    };
    CreateCategoryDto: {
      name: string;
      color: string;
    };
    UpdateTaskDto: {
      name: string;
      categoryId: string;
      /** Format: int64 */
      duration: number;
      /** Format: date-time */
      startTime: string;
      /** Format: date-time */
      endTime: string;
    };
    UpdateCategoryDto: {
      name: string;
      color: string;
    };
    CurrentTaskDto: {
      name: string;
      categoryId: string;
      /** Format: int64 */
      duration: number;
      /** Format: int64 */
      remainingDuration: number;
      isPaused: boolean;
      /** Format: date-time */
      startTime: string;
      /** Format: date-time */
      lastStartTime: string;
    };
    ListTaskDto: {
      id: string;
      name: string;
      categoryId: string;
      /** Format: int64 */
      duration: number;
      /** Format: date-time */
      startTime: string;
      /** Format: date-time */
      endTime?: string;
    };
    PagedListDtoListTaskDto: {
      /** Format: int32 */
      page: number;
      /** Format: int32 */
      totalPages: number;
      items: components["schemas"]["ListTaskDto"][];
    };
    DateTotalDurationDto: {
      /** Format: date */
      date: string;
      /** Format: int64 */
      totalDuration: number;
    };
    YearlyOverviewDto: {
      dates: components["schemas"]["DateTotalDurationDto"][];
    };
    CategoryTotalDurationDto: {
      categoryId: string;
      /** Format: int64 */
      totalDuration: number;
    };
    WeeklyOverviewDto: {
      categories: components["schemas"]["CategoryTotalDurationDto"][];
      dates: components["schemas"]["DateTotalDurationDto"][];
    };
    DailyOverviewDto: {
      categories: components["schemas"]["CategoryTotalDurationDto"][];
    };
    ListCategoryDto: {
      id: string;
      name: string;
      color: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  postAddTask: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["AddTaskDto"];
      };
    };
    responses: {
      /** @description Created */
      201: {
        content: never;
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  postResumeCurrentTask: {
    responses: {
      /** @description OK */
      200: {
        content: never;
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  postPauseCurrentTask: {
    responses: {
      /** @description OK */
      200: {
        content: never;
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  postEndCurrentTask: {
    responses: {
      /** @description OK */
      200: {
        content: never;
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  postCreateCurrentTask: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateCurrentTaskDto"];
      };
    };
    responses: {
      /** @description Created */
      201: {
        content: never;
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  postCreateCategory: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateCategoryDto"];
      };
    };
    responses: {
      /** @description Created */
      201: {
        content: never;
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  deleteTask: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: never;
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  patchUpdateTask: {
    parameters: {
      path: {
        id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateTaskDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: never;
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  deleteCategory: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: never;
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  patchUpdateCategory: {
    parameters: {
      path: {
        id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateCategoryDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: never;
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  getCurrentTask: {
    responses: {
      /** @description OK */
      200: {
        content: {
          "*/*": components["schemas"]["CurrentTaskDto"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  getAllTasks: {
    parameters: {
      query: {
        page: number;
        categoryId?: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "*/*": components["schemas"]["PagedListDtoListTaskDto"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  getYearlyOverview: {
    responses: {
      /** @description OK */
      200: {
        content: {
          "*/*": components["schemas"]["YearlyOverviewDto"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  getWeeklyOverview: {
    parameters: {
      query?: {
        date?: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "*/*": components["schemas"]["WeeklyOverviewDto"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  getDailyOverview: {
    parameters: {
      query?: {
        date?: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "*/*": components["schemas"]["DailyOverviewDto"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
  getAllCategories: {
    responses: {
      /** @description OK */
      200: {
        content: {
          "*/*": components["schemas"]["ListCategoryDto"][];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
      /** @description Not Found */
      404: {
        content: {
          "*/*": components["schemas"]["ProblemDetail"];
        };
      };
    };
  };
}