<template>
  <div class="w-fit max-w-[600px] max-h-screen overflow-y-auto" id="organisms-commands">
		<Accordion v-model:activeIndex="active" expandIcon="pi pi-angle-down" collapseIcon="pi pi-angle-up">
			<AccordionTab v-for="command in commands" :key="command.name">
				<template #header>
					<div class="w-[600px] flex justify-between items-center">
						<span>{{ command.name }}</span>				
						<MoleculesCommandTypeSelector
							class="mx-auto ml-5"
							v-model:time-set="command.timeSet"
						/>
						<Button 
							rounded 
							text 
							class="hover:text-red-400" 
							@click="deleteCommand(command)" 
						>
              <i class="pi pi-times text-[12px]"></i>
            </Button>
					</div>
				</template>
				<div class="flex flex-col relative gap-5">
					<MoleculesKeywords
						v-if="command.timeSet.mode === 'keyword'"
						:command="command"
					/>
					<MoleculesResponses
						:command="command"
					/>
					<MoleculesSaveDiscard 
						class="self-end"
						@save="saveCommand(command)"
						@discard="discardChanges"			
						:discard-disabled="commandMatch(globalStore.savedCommands, command)"	
						:save-disabled="commandMatch(globalStore.savedCommands, command)"	
					/>
				</div>
			</AccordionTab>
			<AccordionTab>
				<template #header>
					<AtomsBaseInput
						class="w-full"
						placeholder="New Command"
						@input-value="handleInputValue"
						@keydown.enter="active = commands.length + 1"
					/>					
				</template>
			</AccordionTab>
		</Accordion>
		<Toast />
		<ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import type { ChatClient } from '@twurple/chat';
import { useGlobalStore } from '~/store/useGlobalStore';

const toast = useToast();
const showSaveToast = () => {
	toast.add({ severity: 'success', summary: 'Saved', detail: 'Command saved', life: 3000 });
};
const showAlreadyExistsToast = () => {
	toast.add({ severity: 'error', summary: 'Error', detail: 'Command already exists, try a different name', life: 5000 });
};
const showDiscardToast = () => {
	toast.add({ severity: 'error', summary: 'Discard', detail: 'Changes discarded', life: 3000 });
}
const showDeletedCommandToast = () => {
	toast.add({ severity: 'warn', summary: 'Deleted', detail: 'Command deleted', life: 3000 });
}

const confirm = useConfirm();
const confirmSaveCommand = () => {
	confirm.require({
		message: `Do you want to save the command?`,
		header: 'Confirmation',
		icon: 'pi pi-exclamation-triangle',
		rejectClass: 'p-button-secondary p-button-outlined',
		rejectLabel: 'Discard',
		acceptLabel: 'Save',
		accept: () => {
			storeCommand();
		},
		reject: () => {
			discardChanges();
		},
	});
};

const active = ref();
const commands = ref<Array<ChatCommand>>([]);
const globalStore = useGlobalStore();

const cloneRef = (clone: any) =>{
	return JSON.parse(JSON.stringify(clone));
}

onMounted(
	() => {
		const localStorageCommands = JSON.parse(localStorage.getItem('commandList') || '[]');
		if (localStorageCommands.length > 0) {
			commands.value = localStorageCommands;
			globalStore.savedCommands = cloneRef(commands.value);
		} else {
			commands.value = [
				{
					name: 'ExampleCommand',
					timeSet: {
						mode: 'keyword',
						time: 1000,
					},
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
							For example: the user @#{sender} sent "#{message}" in the channel: #{channel}.`
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
			];
			globalStore.savedCommands = cloneRef(commands.value);
		};
	},
);

const handleInputValue = (message: string) => {
	let commandAlreadyExists = false;
	commands.value.filter(command => {
		if (command.name.toLowerCase().trim() === message.toLowerCase().trim()) {
			commandAlreadyExists = true;
		};
	});

	if (commandAlreadyExists) {
		showAlreadyExistsToast();
	} else {
		if (message.length !== 0) {
			commands.value.push({
				name: message,
				timeSet: {
					mode: 'keyword',
					time: 1000,
				},
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

const { $chatClient } = useNuxtApp();
const chatClient = $chatClient as ChatClient;
onMounted(
	() => {
		useOnMessage(chatClient, commands.value);
	},
);

const storeCommand = () => {
	globalStore.savedCommands = cloneRef(commands.value);
	localStorage.setItem('commandList', JSON.stringify(globalStore.savedCommands));
	useOnMessage(chatClient, globalStore.savedCommands);
};

const deleteCommand = (commandToDelete: ChatCommand) => {
	commands.value = commands.value.filter( command => command.name !== commandToDelete.name);
	globalStore.savedCommands = cloneRef(commands.value);
	if (commandToDelete.timeSet.mode === 'keyword') {
		delete globalStore.keywordMessages[commandToDelete.name];
	} else if (commandToDelete.timeSet.mode === 'timer') {
		clearInterval(globalStore.timerMessages[commandToDelete.name]);
		delete globalStore.timerMessages[commandToDelete.name];
	}
	storeCommand();
	showDeletedCommandToast();
};

const deepEqual = (obj1: any, obj2: any): boolean => {
	if (obj1 === obj2) return true;
	if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
		return false;
	}
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);
	if (keys1.length !== keys2.length) return false;
	for (const key of keys1) {
		if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
			return false;
		}
	}
	return true;
};

const commandMatch = (savedCommands: any[], command: any): boolean => {
	for (const savedCommand of savedCommands) {
		if (deepEqual(savedCommand, command)) {
			return true;
		}
	}
	return false;
};

const saveCommand = (commandToSave: ChatCommand) => {
  let commandArr: Array<ChatCommand> = cloneRef(globalStore.savedCommands);

  commandArr.forEach((command, index) => {
    if (command.name === commandToSave.name) {
      commandArr[index] = commandToSave;
    };
  });

	globalStore.savedCommands = cloneRef(commandArr);
	storeCommand();
	showSaveToast();
};

const discardChanges = () => {
	commands.value = cloneRef(globalStore.savedCommands);
	showDiscardToast();
};

watch(
	active,
	() => {
		if (!deepEqual(globalStore.savedCommands, commands.value)) {
			confirmSaveCommand()
		};
	},
);

</script>
