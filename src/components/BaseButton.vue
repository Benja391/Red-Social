<script setup>
defineProps({
    color: {
        type: String,
        default: 'blue',        
    }
});
</script>

<template>
    <button
        type="submit"
        class="w-full py-2 px-4 rounded  text-white "
        :class ="{
            'bg-blue-700' : color == 'blue',
            'hover:bg-blue-500': color == 'blue',
            'focus:bg-blue-500': color == 'blue',
            'active:bg-blue-900': color =='blue', 
        }"
    >    
        <slot />
    </button>
</template>