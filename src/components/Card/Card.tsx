import { gsap } from 'gsap'
import React, { useEffect, useRef, useState } from 'react'
import { useGame } from '../context/GameContext'
import style from './Card.module.css'

export const Card: React.FC = () => {
	const { currentWord, options, checkAnswer, isGameOver } = useGame()
	const cardRef = useRef<HTMLDivElement>(null)
	const backgroundRef = useRef<HTMLDivElement>(null)

	const [isFlipped, setIsFlipped] = useState(false)
	const [bgColor, setBgColor] = useState('#ffffff')
	const [content, setContent] = useState({ word: currentWord, options })

	// Пул цветов для фона карточки
	const colorPool = [
		'#FFC107',
		'#FF5722',
		'#4CAF50',
		'#2196F3',
		'#9C27B0',
		'#3F51B5',
	]

	// Обновление содержимого и цвета фона при смене слова
	useEffect(() => {
		if (isGameOver) {
			setBgColor('#f9f9f9') // Цвет фона при завершении игры
		} else if (isFlipped) {
			setBgColor('#ffffff') // Цвет фона при выборе ответа
		} else {
			setContent({ word: currentWord, options })
			updateBackgroundColor()
		}
	}, [currentWord, options, isFlipped, isGameOver])

	// Функция для выбора случайного цвета из пула
	const updateBackgroundColor = () => {
		const newColor = colorPool[Math.floor(Math.random() * colorPool.length)]
		setBgColor(newColor)
		gsap.to(backgroundRef.current, { backgroundColor: newColor, duration: 0.5 })
	}

	const handleAnswerClick = (answer: string) => {
		if (isGameOver) return

		gsap.to(cardRef.current, {
			rotationY: 180,
			duration: 0.5,
			onComplete: () => {
				setIsFlipped(true)
				setContent({ word: 'Выберите ответ...', options: [] })

				checkAnswer(answer)

				setTimeout(() => {
					setContent({ word: currentWord, options })
					gsap.to(cardRef.current, {
						rotationY: 0,
						duration: 0.5,
						onComplete: () => {
							setIsFlipped(false)
						},
					})
				}, 500)
			},
		})
	}

	return (
		<div className={style.cardContainer}>
			<div
				className={style.cardBackground}
				ref={backgroundRef}
				style={{ backgroundColor: bgColor }}
			></div>
			<div className={style.card} ref={cardRef}>
				<div className={isFlipped ? style.cardBack : style.cardFront}>
					{isFlipped ? (
						<p>Выберите ответ...</p>
					) : isGameOver ? (
						<p>C'est fini</p>
					) : (
						<>
							<h3>{content.word}</h3>
							<ul>
								{content.options.map(option => (
									<li key={option} onClick={() => handleAnswerClick(option)}>
										{option}
									</li>
								))}
							</ul>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
