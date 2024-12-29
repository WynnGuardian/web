<script setup lang="ts">
import { Ref, ref } from 'vue'
import { useRoute } from 'vue-router';
import { Criteria } from '../models/Criteria';
import { Survey } from '../models/Survey';
import * as api from '../api/survey'

const route = useRoute()
const survey: Ref<Survey | undefined> = ref(undefined)
const criteria: Ref<Criteria | undefined> = ref(undefined)
const surveyId = ref(route.params.surveyId)
const token = ref(route.query.token)
const gone = ref(false);
const ok = ref(false);
const voteOk = ref(false);
const err: Ref<string> = ref("")
const votes: Ref<number[]> = ref([])

const onInput = (index: number) => {
  if (votes.value[index] < 0) {
    votes.value[index] = 0;
    err.value = 'Weight must be between 99 and 101';
  } else if (votes.value[index] > 100) {
    votes.value[index] = 100;
    err.value = 'Weight must be between 99 and 101';
  } else {
    err.value = '';
  }

  if (votes.value.reduce((a,b) => a+b) != 100) {
    err.value = "Weights sum must be equals 100"
  }
};

const sendVote = () => {
  let votesMap = new Map<string, number>();
  let statsKeys = Object.keys(criteria.value!.modifiers)
  for(let i = 0; i < statsKeys.length; i++) {
    votesMap.set(statsKeys[i], votes.value[i])
  }
  api.sendVote(token.value as string, votesMap, (resp) => {
    if(resp.status != 200) {
      alert(`Error: ${resp.message}`)
      return
    }
    voteOk.value = true;
  })
}

api.findSurvey(surveyId.value as string, (resp) => {
  console.log(resp)
  survey.value = resp.body[0].survey;
  criteria.value = resp.body[0].criteria;
  Object.keys(criteria.value.modifiers).forEach((_,i) => votes.value[i] = 0)
})
</script>

<template>

  <div>
    <div v-if="!ok && !voteOk" class="h-screen flex flex-col justify-center font-jetbrains font-light ">
      <div v-if="gone || survey == undefined" class="mx-auto">
        <h2 class="text-3xl text-center font-semibold text-gray-800">WynnGuardian - Survey voting</h2>
        <p class="text-center mt-4">Survey with id <span class="bg-gray-700 text-white p-1 rounded-md">{{ surveyId }}</span> does not exist os is not open anymore.</p>
      </div>
      <div v-else class="w-fit mx-auto text-center">
        <h2 class="text-3xl font-semibold text-gray-800">WynnGuardian - Survey voting</h2>
        <br>
        <p>Before voting, please read the instructions:</p>
        <p>- The sum of all the weights must be between 99 and 101</p>
        <p>- Use the 00.00 format.</p>
        <br>
        <p>Do not troll. Votes will be reviewed before being contabilized.</p>
        <p>Be honest with your opinion, but don't try to putting 100% weight on sprint regen, for example.</p>
        <br>
        <p>After your vote get contabilized, you will receive a notification in Discord.</p>
        <br>
        <button class="px-16 py-4 bg-indigo-500 text-white" @mousedown="ok = true">Vote</button>
      </div>
    </div>
    <div v-if="ok && !voteOk" class="h-screen flex flex-col justify-center font-jetbrains font-light ">
      <div class="w-fit mx-auto text-center">
        <h2 class="text-3xl font-semibold text-gray-800">WynnGuardian - Survey for: {{ survey!.item_name }}</h2>
        <br><br>
        <div v-for="(stat, index) in Object.keys(criteria!.modifiers)" class="mx-auto grid grid-cols-2 grid-rows-1 w-fit">
          <p class="text-left w-48">{{ stat }}</p>
          <span>
            <input v-model="votes[index]" @input="onInput(index)" class="border-[1px] p-1 border-indigo-500 mb-4" type="number" max="100" min="0"/>
            %
          </span>
        </div>
        <br>
        <p class="text-red-400" v-if="err != undefined">{{ err }}</p>
        <br>
        <button @mousedown="sendVote" class="px-16 py-4 text-white" :class="[votes.reduce((a,b) => a+b) != 100 ? 'bg-gray-400' : 'bg-indigo-600']">Send</button>
      </div>
    </div>
    <div v-if="ok && voteOk" class="h-screen text-center flex flex-col justify-center font-jetbrains font-light ">
        <h1 class="text-4xl">Vote successfully sent for review.</h1>
        <p>You'll receive a notification in your Discord when your vote get contabilized.</p>
      </div>
  </div>
</template>
