export interface Word {
	id: number
	french: string
	translations: string[]
	correctTranslation: string
}

export interface Progress {
	score: number
	level: number
}
