<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Brush, Settings, Sparkles, Zap } from 'lucide-vue-next';
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div class="container mx-auto p-6">
            <!-- Header -->
            <div class="mb-8">
                <div class="mb-2 flex items-center gap-3">
                    <div class="bg-primary/10 rounded-lg p-2">
                        <Brush class="text-primary h-6 w-6" />
                    </div>
                    <h1 class="text-3xl font-bold tracking-tight">PowerUp Factory</h1>
                </div>
                <p class="text-muted-foreground">Design and create powerful abilities</p>
            </div>

            <div class="grid gap-6 lg:grid-cols-3">
                <!-- Main form -->
                <div class="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2">
                                <Settings class="h-5 w-5" />
                                Power-Up Configuration
                            </CardTitle>
                            <CardDescription>Configure the properties and behavior of your new power-up</CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-6">
                            <!-- Basic Properties -->
                            <div class="grid gap-4 md:grid-cols-2">
                                <div class="space-y-2">
                                    <Label htmlFor="name">Power-Up Name</Label>
                                    <Input id="name" placeholder="Lightning Strike" class="font-medium" />
                                </div>
                                <div class="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select>
                                        <SelectTrigger class="w-full">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="attack">Attack</SelectItem>
                                            <SelectItem value="defense">Defense</SelectItem>
                                            <SelectItem value="speed">Speed</SelectItem>
                                            <SelectItem value="firerate">FireRate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <!-- Stats -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold">Bonus stats</h3>
                                <div class="grid gap-4 md:grid-cols-2">
                                    <div class="space-y-2">
                                        <Label htmlFor="damage">Bonus type</Label>
                                        <Select>
                                            <SelectTrigger class="w-full">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="increase">Increase</SelectItem>
                                                <SelectItem value="decrease">Decrease</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div class="space-y-2">
                                        <Label htmlFor="duration">Multiplier (1.1 = +10%)</Label>
                                        <Input id="duration" type="number" placeholder="1.1" min="1" step="0.1" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label htmlFor="cooldown">Percentage</Label>
                                        <Input id="cooldown" type="number" placeholder="10%" min="0" />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <!-- Addtionnal Properties -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold">Additional Properties</h3>
                                <div class="grid gap-4 md:grid-cols-2">
                                    <div class="space-y-2">
                                        <Label htmlFor="rarity">Rarity Level</Label>
                                        <Select>
                                            <SelectTrigger class="w-full">
                                                <SelectValue placeholder="Select rarity" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="common">Common</SelectItem>
                                                <SelectItem value="uncommon">Uncommon</SelectItem>
                                                <SelectItem value="rare">Rare</SelectItem>
                                                <SelectItem value="epic">Epic</SelectItem>
                                                <SelectItem value="legendary">Legendary</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div class="space-y-2">
                                        <Label htmlFor="unlock-level">Unlock Level</Label>
                                        <Input id="unlock-level" type="number" placeholder="1" min="1" />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <!-- Description -->
                            <div class="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the power-up's effects, special mechanics..."
                                    class="min-h-[120px] resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- Preview Panel -->
                <div class="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2">
                                <Sparkles class="h-5 w-5" />
                                Preview
                            </CardTitle>
                            <CardDescription>Live preview of your power-up</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="space-y-4">
                                <div
                                    class="from-primary/20 to-primary/5 border-primary/20 flex aspect-square items-center justify-center rounded-lg border-2 border-dashed bg-gradient-to-br"
                                >
                                    <div class="text-center">
                                        <Zap class="text-primary/40 mx-auto mb-2 h-12 w-12" />
                                        <p class="text-muted-foreground text-sm">Power-Up Icon</p>
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-muted-foreground">Name:</span>
                                        <span class="font-medium">Lightning Strike</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-muted-foreground">Type:</span>
                                        <span class="font-medium">Attack</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-muted-foreground">Rarity:</span>
                                        <span class="font-medium text-purple-600">Epic</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-muted-foreground">Percentage:</span>
                                        <span class="font-medium">10%</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Action Buttons -->
                    <div class="space-y-3">
                        <Button class="w-full" size="lg">
                            <Zap class="mr-2 h-4 w-4" />
                            Create Power-Up
                        </Button>
                        <Button variant="destructive" class="w-full"> Reset Form </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
