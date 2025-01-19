export const shuffleArray = (array: string[]): string[] => {
	const shuffled = [...array]
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}
	return shuffled
}

export const updateBackgroundColor = (
	isGameOver: boolean,
	isFlipped: boolean
): string => {
	const color = isGameOver ? '#f9f9f9' : isFlipped ? '#ffffff' : '#ffffff'
	return color
}

export const initializeCardContent = (
	currentWord: string,
	options: string[]
): { word: string; options: string[] } => {
	const content = {
		word: currentWord || 'Error, Patron, patron, tout est perdu.',
		options: shuffleArray(options),
	}
	return content
}
