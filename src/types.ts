import { ReactNode } from 'react'

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

export interface GameState {
	currentWord: string
	options: string[]
	score: number
	level: string
	complexity: number
	checkAnswer: (answer: string) => void
	isGameOver: boolean
	setLevel: React.Dispatch<React.SetStateAction<string>>
	setComplexity: React.Dispatch<React.SetStateAction<number>>
	isRiskMode: boolean
	activateRiskMode: () => void
	startGame: (
		selectedLevel: string,
		selectedComplexity: string
	) => Promise<void>
	type: string
	correctAnswer: string
}

export type GameProviderProps = {
	children: ReactNode
}

export interface StartScreenProps {
	onStart: () => void
}

export interface SettingsScreenProps {
	onConfirm: (data: any) => void
}

export interface CardProps {
	onRestart: () => void
}

export interface GameOverScreenProps {
	score: number
	onRestart: () => void
}

export interface CardContentProps {
	word: string
	options: string[]
	onAnswerClick: (answer: string) => void
	type: string
	correctAnswer: string
}
