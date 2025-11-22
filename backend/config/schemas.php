<?php

return [
    'default_project_details_schema' => [
        'description' => [
            'type' => 'string',
            'label' => 'Description',
            'multiline' => true,
            'required' => true,
            'order' => 1,
        ],
        'ownerUserId' => [
            'type' => 'user',
            'label' => 'Owner',
            'required' => false,
            'order' => 2,
        ],
        'startDate' => [
            'type' => 'date',
            'label' => 'Start Date',
            'required' => false,
            'order' => 3,
        ],
        'expectedCompletionDate' => [
            'type' => 'date',
            'label' => 'Expected Completion Date',
            'required' => false,
            'order' => 4,
        ],
        'status' => [
            'type' => 'enum',
            'label' => 'Status',
            'options' => [
                ['value' => 'planned', 'label' => 'Planned', 'order' => 1],
                ['value' => 'in_progress', 'label' => 'In Progress', 'order' => 2],
                ['value' => 'on_hold', 'label' => 'On Hold', 'order' => 3],
                ['value' => 'completed', 'label' => 'Completed', 'order' => 4],
            ],
            'required' => true,
            'default' => 'planned',
            'order' => 5,
        ],
        'tags' => [
            'type' => 'string[]',
            'label' => 'Tags',
            'required' => false,
            'order' => 6,
        ],
    ],

    'default_activity_details_schema' => [
        'description' => [
            'type' => 'string',
            'label' => 'Description',
            'multiline' => true,
            'required' => true,
            'order' => 1,
        ],
        'assigneeUserId' => [
            'type' => 'user',
            'label' => 'Assignee',
            'required' => false,
            'order' => 2,
        ],
        'status' => [
            'type' => 'enum',
            'label' => 'Status',
            'options' => [
                ['value' => 'todo', 'label' => 'To Do', 'order' => 1],
                ['value' => 'in_progress', 'label' => 'In Progress', 'order' => 2],
                ['value' => 'blocked', 'label' => 'Blocked', 'order' => 3],
                ['value' => 'done', 'label' => 'Done', 'order' => 4],
            ],
            'required' => true,
            'default' => 'todo',
            'order' => 3,
        ],
        'dueDate' => [
            'type' => 'date',
            'label' => 'Due Date',
            'required' => false,
            'order' => 4,
        ],
        'estimateHours' => [
            'type' => 'number',
            'label' => 'Estimate (hours)',
            'required' => false,
            'order' => 5,
        ],
    ],
];
