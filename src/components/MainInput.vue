<script>
export default {
    name:'MainInput',
    emits:['update:modelValue'],
    props:{
        modelValue: {
            type: String,
        },
    },
}
</script>

<template>
    <input 

    class="bg-[#616160]  text-white p-4 border border-[#83B1DF] rounded"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    >
</template>