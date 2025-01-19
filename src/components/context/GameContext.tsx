import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { GameProviderProps, GameState } from '../../types'

const GameContext = createContext<GameState | undefined>(undefined)

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
	const [score, setScore] = useState(0)
	const [level, setLevel] = useState<string>('beginner')
	const [complexity, setComplexity] = useState<number>(1)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isGameOver, setIsGameOver] = useState(false)
	const [wordsList, setWordsList] = useState<
		{ word: string; options: string[]; correctAnswer: string }[]
	>([])
	const [currentWord, setCurrentWord] = useState('')
	const [options, setOptions] = useState<string[]>([])
	const [isRiskMode, setIsRiskMode] = useState(false)
	const [isGameInitialized, setIsGameInitialized] = useState(false)

	const fetchWords = async (
		currentLevel: string,
		currentComplexity: string
	) => {
		if (!currentLevel || !currentComplexity) {
			console.warn('fetchWords called with invalid parameters', {
				currentLevel,
				currentComplexity,
			})
			return
		}

		try {
			if (currentComplexity === 'risk') {
				const response = await axios.get(
					'http://localhost:3001/api/je-prendrai-le-risque',
					{
						params: { level: currentLevel },
					}
				)
				setWordsList(response.data)
			} else {
				const params: Record<string, string> = { level: currentLevel }
				if (currentComplexity === 'mot-du-jour') {
					params.mode = 'mot-du-jour'
				} else {
					params.complexity = currentComplexity
				}

				const response = await axios.get(
					'http://localhost:3001/api/questions',
					{
						params,
					}
				)
				setWordsList(response.data)
			}

			setCurrentIndex(0)
			setIsGameOver(false)
		} catch (error) {
			console.error('Error fetching words list:', error)
		}
	}

	const startGame = async (
		selectedLevel: string,
		selectedComplexity: string
	) => {
		setIsGameInitialized(true)
		setLevel(selectedLevel)
		setComplexity(Number(selectedComplexity))
		await fetchWords(selectedLevel, selectedComplexity)
	}

	const checkAnswer = (answer: string) => {
		if (
			isGameOver ||
			wordsList.length === 0 ||
			currentIndex >= wordsList.length
		) {
			console.warn('Cannot check answer: game over or invalid state')
			return
		}

		const isCorrect = wordsList[currentIndex]?.correctAnswer === answer

		if (isCorrect) {
			setScore(prevScore => {
				const newScore = prevScore + 1

				// Проверяем завершение уровня
				if (newScore >= 5 && currentIndex === wordsList.length - 1) {
					setLevel(prevLevel => {
						if (prevLevel === 'beginner') return 'intermediate'
						if (prevLevel === 'intermediate') return 'advanced'
						return prevLevel
					})
					return 0 // Сброс счёта для нового уровня
				}

				return newScore
			})
		}

		if (currentIndex < wordsList.length - 1) {
			setCurrentIndex(prevIndex => prevIndex + 1)
		} else {
			setIsGameOver(true)
		}
	}

	useEffect(() => {
		if (
			isGameInitialized &&
			wordsList.length > 0 &&
			currentIndex >= 0 &&
			currentIndex < wordsList.length
		) {
			setCurrentWord(wordsList[currentIndex].word)
			setOptions(wordsList[currentIndex].options)
		} else {
			setCurrentWord('')
			setOptions([])
		}
	}, [wordsList, currentIndex, isGameInitialized])

	return (
		<GameContext.Provider
			value={{
				currentWord,
				options,
				score,
				level,
				complexity,
				checkAnswer,
				isGameOver,
				setLevel,
				setComplexity,
				isRiskMode,
				activateRiskMode: () => setIsRiskMode(true),
				startGame,
			}}
		>
			{children}
		</GameContext.Provider>
	)
}

export const useGame = () => {
	const context = useContext(GameContext)
	if (!context) {
		throw new Error('useGame must be used within a GameProvider')
	}
	return context
}
