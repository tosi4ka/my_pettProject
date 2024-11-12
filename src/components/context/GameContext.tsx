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

	// Функция для загрузки списка слов с сервера
	const fetchWords = async () => {
		try {
			const response = await axios.get('http://localhost:3001/api/questions')
			setWordsList(response.data)
		} catch (error) {
			console.error('Error fetching words list:', error)
		}
	}

	// Загрузка данных с сервера при монтировании компонента
	useEffect(() => {
		fetchWords()
	}, [])

	// Обновление текущего слова и вариантов при изменении `currentIndex`
	useEffect(() => {
		if (wordsList.length > 0 && currentIndex < wordsList.length) {
			setCurrentWord(wordsList[currentIndex].word)
			setOptions(wordsList[currentIndex].options)
		}
	}, [wordsList, currentIndex])

	const checkAnswer = (answer: string) => {
		if (isGameOver) return // Остановка, если игра закончена

		if (wordsList[currentIndex].correctAnswer === answer) {
			setScore(score + 1)
			if (score + 1 >= 5) {
				setLevel(level + 1)
				setScore(0)
			}
		} else {
			setScore(0) // Сброс счёта при неправильном ответе
		}

		// Переход к следующему слову или завершение игры
		if (currentIndex < wordsList.length - 1) {
			setCurrentIndex(currentIndex + 1)
		} else {
			setIsGameOver(true) // Установка флага окончания игры
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
