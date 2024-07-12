<template>
  <div class="w-fit max-w-[600px] max-h-screen overflow-y-auto">
		<Accordion :activeIndex="0" expandIcon="pi pi-angle-down" collapseIcon="pi pi-angle-up">
			<AccordionTab v-for="command in commands">
				<template #header>
					<div class="w-[600px] flex justify-between items-center">
						<span>{{ command.name }}</span>
						<Button rounded text class="hover:text-red-400" @click="deleteCommand(command.name)" >
              <i class="pi pi-times text-[12px]"></i>
            </Button>
					</div>
				</template>
				<MoleculesKeywords
				:command="command"
				/>
				<MoleculesResponses
				:command="command"
				/>
			</AccordionTab>
			<AccordionTab>
				<template #header>
					<div class="w-[600px]">
						<AtomsBaseInput
                placeholder="New Command"
                @input-value="handleInputValue"
              />
					</div>					
				</template>
				<div class="max-w-[600px] flex flex-col gap-1">
				</div>
			</AccordionTab>
	</Accordion>
	<pre>
		{{ commands }}
	</pre>
  </div>
</template>

<script setup lang="ts">
import type { ChatClient } from '@twurple/chat';

const handleInputValue = (message: string) => {
	let commandAlreadyExists = false;
	commands.value.filter(command => {
		if (command.name === message) {
			commandAlreadyExists = true;
		};
	});

	if (commandAlreadyExists) {
		alert('Command already exists, try a different name');
	} else {
		if (message.length !== 0) {
			commands.value.push({
				name: message,
				keywordSet: {
					firstKeywordSet: [
						{
							isExact: false,
							keyword: message,
						},
					]
				},
				responses: [],
			});
		};
	};
};

const commands = ref<Array<ChatCommand>>([
	{
		name: 'Example Command',
		keywordSet: {
			firstKeywordSet: [
				{
					isExact: false,
					keyword: 'car',
				},
				{
					isExact: true,
					keyword: 'skate',
				},
			]
		},
		responses: [
			{
				id: 0,
				response: `You can use #{} to pick information about the message. 
        For example: the user @#{sender} sent the message in the channel: #{channel}.`
			},
			{
				id: 1,
				response: `Try it yourself: type 'car' or 'skate' in Twitch chat when you are joined as a bot.
        You will see that words like 'carrot' and 'scar' will trigger 'car' because it is not checked, but 'skates' or 'skateboard' will not trigger because it is checked as an exact match.`
			},
      {
        id: 2,
        response: `If there is more than one response, it will be chosen randomly.`
      }
		],
	},
]);

const { $chatClient } = useNuxtApp();
const chatClient = $chatClient as ChatClient;

onMounted(
	() => {
		useOnMessage(chatClient, commands.value);
	},
);

watch(
	() => commands.value,
	(newValue) => {
		useOnMessage(chatClient, newValue);
	},
	{ deep: true },
);

const deleteCommand = (commandName: string) => {
	commands.value = commands.value.filter( command => command.name !== commandName);
};
</script>
