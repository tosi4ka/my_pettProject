import { gsap } from 'gsap'
import React, { useEffect, useRef, useState } from 'react'
import { CardProps } from '../../types'
import { CardContent } from '../CardContent/CardContent'
import { useGame } from '../context/GameContext'
import { GameOverScreen } from '../GameOverScreen/GameOverScreen'
import style from './Card.module.css'
import { initializeCardContent, updateBackgroundColor } from './cardHelpers'

export const Card: React.FC<CardProps> = ({ onRestart }) => {
	const {
		currentWord,
		options,
		checkAnswer,
		isGameOver,
		score,
		type,
		correctAnswer,
	} = useGame()
	const cardRef = useRef<HTMLDivElement>(null)
	const backgroundRef = useRef<HTMLDivElement>(null)

	const [isFlipped, setIsFlipped] = useState(false)
	const [bgColor, setBgColor] = useState('#ffffff')
	const [content, setContent] = useState(
		initializeCardContent(currentWord, options)
	)

	useEffect(() => {
		const newBgColor = updateBackgroundColor(isGameOver, isFlipped)
		setBgColor(newBgColor)
	}, [isGameOver, isFlipped])

	useEffect(() => {
		if (!isGameOver && !isFlipped && currentWord && options.length > 0) {
			const newContent = initializeCardContent(currentWord, options)
			setContent(newContent)
		}
	}, [currentWord, options, isFlipped, isGameOver])

	const handleAnswerClick = (answer: string) => {
		if (isGameOver) return

		console.log('Answer clicked:', answer)

		if (!cardRef.current) {
			console.warn('cardRef is not initialized')
			return
		}

		gsap.to(cardRef.current, {
			rotationY: 180,
			duration: 0.5,
			onComplete: () => {
				setIsFlipped(true)
				setContent({ word: 'Choisissez une réponse...', options: [] })

				checkAnswer(answer)

				setTimeout(() => {
					const newContent = initializeCardContent(currentWord, options)
					console.log('Restoring content after flip:', newContent)

					setContent(newContent)
					if (cardRef.current) {
						gsap.to(cardRef.current, {
							rotationY: 0,
							duration: 0.5,
							onComplete: () => {
								setIsFlipped(false)
							},
						})
					}
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
						<p>Sélectionnez la réponse...</p>
					) : isGameOver ? (
						<GameOverScreen score={score} onRestart={onRestart} />
					) : (
						<CardContent
							word={content.word}
							options={content.options}
							onAnswerClick={handleAnswerClick}
							type={type}
							correctAnswer={correctAnswer}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
