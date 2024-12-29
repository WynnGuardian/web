import type { Criteria } from "../models/Criteria";
import type { Survey } from "../models/Survey";
import { post, type APIResponse } from "./api";

export function findSurvey(id: string, handler: (resp: APIResponse<{survey: Survey, criteria: Criteria}[]>) => void) {
  post("findOpenSurvey?attachCriteria=true", ({ id: id, limit: 1, page: 1 }), handler)
}

export function sendVote(token: string, votes: Map<string, number>, handler: (resp: APIResponse<any>) => void) {
  post("sendVote", ({ token: token, votes: Object.fromEntries(votes)}), handler)
}
