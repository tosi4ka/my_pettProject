import axios from 'axios'
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

type GameState = {
	currentWord: string
	options: string[]
	score: number
	level: number
	checkAnswer: (answer: string) => void
	isGameOver: boolean
}

const GameContext = createContext<GameState | undefined>(undefined)

type GameProviderProps = {
	children: ReactNode
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
	const [score, setScore] = useState(0)
	const [level, setLevel] = useState(1)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isGameOver, setIsGameOver] = useState(false)
	const [wordsList, setWordsList] = useState<
		{ word: string; options: string[]; correctAnswer: string }[]
	>([])
	const [currentWord, setCurrentWord] = useState('')
	const [options, setOptions] = useState<string[]>([])

	const fetchWords = async () => {
		try {
			const response = await axios.get('http://localhost:3001/api/questions')
			setWordsList(response.data)
		} catch (error) {
			console.error('Error fetching words list:', error)
		}
	}

	useEffect(() => {
		fetchWords()
	}, [])

	useEffect(() => {
		if (wordsList.length > 0 && currentIndex < wordsList.length) {
			setCurrentWord(wordsList[currentIndex].word)
			setOptions(wordsList[currentIndex].options)
		} else {
			console.warn('Invalid currentIndex or wordsList is empty')
		}
	}, [wordsList, currentIndex])

	const checkAnswer = (answer: string) => {
		if (isGameOver) return

		if (wordsList.length === 0 || currentIndex >= wordsList.length) {
			console.warn('Words list is not ready or currentIndex is out of bounds')
			return
		}

		if (wordsList[currentIndex]?.correctAnswer === answer) {
			setScore(prevScore => {
				const newScore = prevScore + 1

				if (newScore >= 5) {
					setLevel(prevLevel => prevLevel + 1)
					console.log('Level up! New level:', level + 1)
					return 0
				}
				return newScore
			})
		} else {
			console.log('Wrong answer! Score remains the same')
		}

		// Переходим к следующему вопросу
		if (currentIndex < wordsList.length - 1) {
			setCurrentIndex(prevIndex => prevIndex + 1)
		} else {
			console.log('Game over!')
			setIsGameOver(true)
		}
	}

	useEffect(() => {
		localStorage.setItem('score', score.toString())
		localStorage.setItem('level', level.toString())
	}, [score, level])

	return (
		<GameContext.Provider
			value={{ currentWord, options, score, level, checkAnswer, isGameOver }}
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
