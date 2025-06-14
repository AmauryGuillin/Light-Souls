<?php

namespace App\Data;

use DateTime;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PowerupData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $description,
        public int $unlockLevel,
        public int $powerup_types_id,
        public int $powerup_boosts_id,
        public int $powerup_assets_id,
        public DateTime $created_at,
        public DateTime $updated_at,
    ) {}
}
