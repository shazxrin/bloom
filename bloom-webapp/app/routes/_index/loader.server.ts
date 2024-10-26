import { json, LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import { format } from "date-fns";
import apiClient from "~/api/apiClient";
import { ok, serverError } from "~/utils/responses.server";

export type LoaderData = {
    dailyOverview: {
        sessionTagTotalDurations: {
            tag: {
                id: string;
                name: string;
                color: string;
            },
            totalDuration: number
        }[]
    },
    weeklyOverview: {
        sessionDateTotalDurations: {
            date: string;
            totalDuration: number
        }[],
        sessionTagTotalDurations: {
            tag: {
                id: string;
                name: string;
                color: string;
            },
            totalDuration: number
        }[]
    },
    yearlyOverview: {
        sessionDateTotalDurations: {
            date: string;
            totalDuration: number
        }[]
    }
}

export async function loader({ request }: LoaderFunctionArgs): Promise<TypedResponse<LoaderData>> {
    const url = new URL(request.url)
    const dailyOverviewDate = format(url.searchParams.get("daily") ?? new Date, "yyyy-MM-dd")
    const weeklyOverviewDate = format(url.searchParams.get("weekly") ?? new Date, "yyyy-MM-dd")
    const yearlyOverviewDate = format(url.searchParams.get("yearly") ?? new Date, "yyyy")

    const dailyOverviewPromise = apiClient.GET("/api/overview/daily", {
        params: {
            query: {
                date: dailyOverviewDate
            }
        }
    })

    const weeklyOverviewPromise = await apiClient.GET("/api/overview/weekly", {
        params: {
            query: {
                date: weeklyOverviewDate
            }
        }
    })

    const yearlyOverviewPromise = await apiClient.GET("/api/overview/yearly", {
        params: {
            query: {
                year: parseInt(yearlyOverviewDate)
            }
        }
    })

    const [dailyOverviewResponse, weeklyOverviewResponse, yearlyOverviewResponse]
        = await Promise.all([dailyOverviewPromise, weeklyOverviewPromise, yearlyOverviewPromise])

    if (dailyOverviewResponse.error
        || weeklyOverviewResponse.error
        || yearlyOverviewResponse.error
    ) {
        throw serverError()
    }

    return ok<LoaderData>({
        dailyOverview: dailyOverviewResponse.data,
        weeklyOverview: weeklyOverviewResponse.data,
        yearlyOverview: yearlyOverviewResponse.data
    })
}
