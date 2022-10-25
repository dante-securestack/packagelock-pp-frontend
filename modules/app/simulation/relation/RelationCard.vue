<template>
  <AppCard :border="'w-4 hover:bg-orange-400 bg-zinc-100'">
    <template v-slot:header>
      <div class="w-full flex items-center relative">

        <div class="absolute top-0 right-0 flex justify-end">
          <AppButton 
            @click="openRelationEditModal()" 
            class="text-zinc-400 hover:text-orange-600">
            <AppIcons icon="edit" />
          </AppButton>
          <AppButton 
            @click="openRelationExcludeModal()" 
            class="text-zinc-400 hover:text-orange-600">
            <AppIcons icon="delete_forever" />
          </AppButton>
        </div>

        <div class="w-full flex flex-col">
          <div class="w-full flex space-x-2 pr-20">
            <h3 class="h3 flex-none text-slate-400">#{{ socialSecurityRelation.seqNumber }}</h3>
            <h3 class="h3 break-words text-slate-400">{{ socialSecurityRelation.relationType }}</h3>
          </div>
          <h3 class="h3 pr-12 break-words">{{ socialSecurityRelation.relationOrigin }}</h3>

          <div class="w-full flex flex-wrap">
            <AppLabelValue class="four-cols-breakdown mt-4">
              <template v-slot:label>Documento</template>
              <template v-slot:value>{{ socialSecurityRelation.relationDocument ? socialSecurityRelation.relationDocument : '--' }}</template>
            </AppLabelValue>
            <AppLabelValue class="four-cols-breakdown mt-4">
              <template v-slot:label>Início</template>
              <template v-slot:value>{{ socialSecurityRelation.startAt ? socialSecurityRelation.startAt : '--' }}</template>
            </AppLabelValue>
            <AppLabelValue class="four-cols-breakdown mt-4">
              <template v-slot:label>Término</template>
              <template v-slot:value>{{ socialSecurityRelation.endAt ? socialSecurityRelation.endAt : '--' }}</template>
            </AppLabelValue>
            <AppLabelValue class="four-cols-breakdown mt-4">
              <template v-slot:label>Tempo especial</template>
              <template v-slot:value>{{ vueNumberFormat(socialSecurityRelation.specialTime, { prefix: '', precision: 2 }) }}</template>
            </AppLabelValue>
            <AppLabelValue class="four-cols-breakdown mt-4">
              <template v-slot:label>Tempo de contribuição</template>
              <template v-slot:value>
                <span v-if="socialSecurityRelation.contributionTime">{{ socialSecurityRelation.contributionTime.time.timeText }}</span>
                <span v-else>--</span>
              </template>
            </AppLabelValue>
          </div>
        </div>
      </div>
    </template>
    
    <template v-slot:content >
      <ContributionList
        :socialSecurityRelation="socialSecurityRelation"
      ></ContributionList>
    </template>
  </AppCard>
</template>

<script setup>

  import ContributionList from '@/modules/app/simulation/relation/contribution/ContributionList.vue'
  import emitter from '@/util/emitter'

  const props = defineProps({
    socialSecurityRelation: Object
  })

  const openRelationEditModal = () => {
    emitter.emit('openRelationEditModal', { socialSecurityRelation: props.socialSecurityRelation })
  }

  const openRelationExcludeModal = () => {
    emitter.emit('openRelationExcludeModal', { socialSecurityRelation: props.socialSecurityRelation })
  }

</script>