<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/vue3';
import { Crown } from 'lucide-vue-next';
import Nav from './Nav.vue';

defineProps<{
    profiles: any;
}>();
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black">
        <Nav />
        <div class="flex w-full flex-col items-center justify-center gap-5 pt-10">
            <h1 class="font-game text-5xl font-bold underline underline-offset-8">LEADERBOARD</h1>
            <div class="w-1/2 pt-10">
                <Table>
                    <TableCaption>Light Souls - leaderboard</TableCaption>
                    <TableBody>
                        <TableRow v-for="(profile, i) in profiles" :key="profile.id" class="hover:bg-red-500/30">
                            <TableCell class="font-medium">
                                <Crown v-if="i === 0" class="text-yellow-300" />
                                <span v-if="i != 0" class="text-lg"> #{{ i + 1 }} </span>
                            </TableCell>
                            <TableCell>
                                <Avatar class="h-10 w-10">
                                    <AvatarFallback class="bg-from-black bg-gradient-to-tr from-black via-black to-red-700">{{
                                        profile.user.name.charAt(0).toUpperCase() || 'X'
                                    }}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>
                                <div class="flex gap-5">
                                    <div class="mb-1 flex items-center gap-2">
                                        <Link
                                            :href="`profile/stats/${profile.user.id}`"
                                            class="cursor-pointer text-lg font-semibold text-white hover:text-white/50"
                                        >
                                            {{ profile.user.name || 'Anonymous' }}
                                        </Link>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <Badge variant="outline" class="border-red-600/50 bg-red-950/30 text-red-300">
                                            Level {{ profile.higher_level || '0' }}
                                        </Badge>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell class="text-right">
                                <div class="text-2xl font-bold">{{ profile.total_enemies_killed || '0' }}</div>
                                <div>Points</div>
                            </TableCell>
                            <TableCell class="text-center">
                                <Badge v-if="i === 0" class="rounded-2xl bg-yellow-600 font-bold text-yellow-100">CHAMPION</Badge>
                                <Badge v-if="i === 1" class="rounded-2xl bg-gray-600 font-bold text-gray-100">RUNNER-UP</Badge>
                                <Badge v-if="i === 2" class="rounded-2xl bg-amber-600 font-bold text-amber-100">THIRD</Badge>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
</template>
