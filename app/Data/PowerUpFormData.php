<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PowerUpFormData extends Data
{
    public function __construct(
        public string $name,
        public string $powerupType,
        public string $bonusType,
        public ?float $multiplier = null,
        public ?int $unlockLevel = null,
        public ?int $assetId = null,
        public string $description,
    ) {}
}
