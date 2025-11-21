<?php

namespace App\Enums;

enum ActivityDetails: string
{
    case DESCRIPTION = 'description';
    case ASSIGNEE_USER_ID = 'assigneeUserId';
    case ESTIMATE_HOURS = 'estimateHours';
    case STATUS = 'status';
    case KIND = 'kind';
    case LINKED_OBJECTIVE_IDS = 'linkedObjectiveIds';
    case EXPERIMENT_PLAN = 'experimentPlan';
    case RESULT_SUMMARY = 'resultSummary';
    case EVIDENCE_LINKS = 'evidenceLinks';
}
