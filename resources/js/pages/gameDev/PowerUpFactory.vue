<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/vue3';
import { Brush, Loader2, Settings, Sparkles, Zap } from 'lucide-vue-next';
import { ref } from 'vue';

defineProps<{
    powerupTypes: [{ id: number; type: string }];
    powerupBoosts: string[];
    powerupAssets: { path: string }[];
}>();

const selectedIllustration = ref<number | null>(null);

const form = useForm<App.Data.PowerUpFormData>({
    name: '',
    powerupType: '',
    bonusType: '',
    multiplier: null,
    unlockLevel: null,
    assetId: null,
    description: '',
});

function handleSelectedIllustration(selectedIllustrationId: number) {
    selectedIllustration.value = selectedIllustrationId;
    if (form.assetId === null) form.assetId = selectedIllustration.value;
}

function deleteForm() {
    selectedIllustration.value = null;
    form.reset();
}
</script>

<template>
    <form
        @submit.prevent="
            form.post(route('powerupfactory.store'), {
                onSuccess: () => {
                    form.reset();
                },
            })
        "
        class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
    >
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
                                    <Input id="name" placeholder="Lightning Strike" class="font-medium" v-model="form.name" />
                                </div>
                                <div class="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select v-model="form.powerupType">
                                        <SelectTrigger class="w-full">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem v-for="item in powerupTypes" v-bind:key="item.id" :value="item.type">{{
                                                item.type
                                            }}</SelectItem>
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
                                        <Select v-model="form.bonusType">
                                            <SelectTrigger class="w-full">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem v-for="item in powerupBoosts" :key="item" :value="item">
                                                    {{ item }}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div class="space-y-2">
                                        <Label htmlFor="duration">Multiplier (1.1 = +10%)</Label>
                                        <Input id="duration" type="number" placeholder="1.1" step="0.1" v-model="form.multiplier!" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label htmlFor="unlock-level">Unlock Level</Label>
                                        <Input id="unlock-level" type="number" placeholder="1" min="1" v-model="form.unlockLevel!" />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <!-- Addtionnal Properties -->
                            <div class="w-full space-y-4">
                                <h3 class="text-lg font-semibold">Additional Properties</h3>
                                <div class="flex items-center justify-center">
                                    <Carousel
                                        class="w-full max-w-sm"
                                        :opts="{
                                            align: 'start',
                                        }"
                                    >
                                        <CarouselContent class="-ml-1">
                                            <CarouselItem v-for="(image, index) in powerupAssets" :key="index" class="pl-1 md:basis-1/2 lg:basis-1/3">
                                                <div class="p-1">
                                                    <Card
                                                        @Click="handleSelectedIllustration(index + 1)"
                                                        class="cursor-pointer transition-all hover:border-white"
                                                        :class="selectedIllustration === index ? 'border-green-400' : ''"
                                                    >
                                                        <CardContent class="flex aspect-square items-center justify-center p-6">
                                                            <img :src="image.path" alt="" />
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
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
                                    v-model="form.description"
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
                                    <div v-if="selectedIllustration === null" class="text-center">
                                        <Zap class="text-primary/40 mx-auto mb-2 h-12 w-12" />
                                        <p class="text-muted-foreground text-sm">Power-Up Icon</p>
                                    </div>
                                    <div v-else class="text-center">
                                        <img :src="powerupAssets[selectedIllustration].path" alt="" />
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
                        <Button class="w-full" size="lg" :disabled="form.processing">
                            <Zap v-if="!form.processing" class="mr-2 h-4 w-4" />
                            <Loader2 v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
                            Create Power-Up
                        </Button>
                        <Button type="button" @Click="deleteForm" variant="destructive" class="w-full"> Reset Form </Button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
