<?php

namespace App\Enums;

enum ProjectDetails: string
{
    case DESCRIPTION = 'description';
    case HYPOTHESIS = 'hypothesis';
    case OBJECTIVES = 'objectives';
    case METRICS = 'metrics';
    case SUCCESS_CRITERIA = 'successCriteria';
    case TAGS = 'tags';
    case OWNER_USER_ID = 'ownerUserId';
}
