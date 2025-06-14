<?php

namespace App\Enum;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum PowerupBoosts: string
{

    case INCREASE = 'Increase';

    case DECREASE = 'Decrease';
}
