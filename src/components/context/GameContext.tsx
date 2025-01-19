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
		{ word: string; options: string[]; correctAnswer: string; type: string }[]
	>([]) // Добавлено поле `type`
	const [currentWord, setCurrentWord] = useState('')
	const [options, setOptions] = useState<string[]>([])
	const [questionType, setQuestionType] = useState<string>('') // Тип текущего вопроса
	const [correctAnswer, setCorrectAnswer] = useState<string>('') // Правильный ответ для `fill-in-the-blank`
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
			setScore(prevScore => prevScore + 1)
		} else {
			console.log('Incorrect answer:', answer)
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
			setQuestionType(wordsList[currentIndex].type) // Устанавливаем тип вопроса
			setCorrectAnswer(wordsList[currentIndex].correctAnswer) // Устанавливаем правильный ответ
		} else {
			setCurrentWord('')
			setOptions([])
			setQuestionType('')
			setCorrectAnswer('')
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
				type: questionType,
				correctAnswer,
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
