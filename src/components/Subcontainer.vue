<script setup lang="ts">

import '@/assets/containers.css';

</script>

<template>

	<div>
		<h4 class="title" v-if="$slots['outer-title']">
			<slot name="outer-title"></slot>
		</h4>
		<div>
			<slot name="before-content"/>
		</div>
		<div class="sub-container container-styling" v-if="$slots['content']">
			<h3 class="title" v-if="$slots['inner-title']">
				<slot name="inner-title"></slot>
			</h3>
			<slot name="content"/>
		</div>
	</div>

</template>