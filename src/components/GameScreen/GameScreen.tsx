import React, { useState } from 'react'
import { Card } from '../Card/Card'
import { Progress } from '../Progress/Progress'
import style from './GameScreen.module.css'

const GameScreen: React.FC = () => {
	const [isGameStarted, setIsGameStarted] = useState(false)

	const handleStart = () => {
		setIsGameStarted(true)
	}

	return (
		<div className={style.wrapTitle}>
			{!isGameStarted ? (
				<div className={style.startScreen}>
					<h1>Game "Memorizing Words"</h1>
					<button onClick={handleStart}>Start</button>
				</div>
			) : (
				<div className={style.wrapCart}>
					<div className={style.titleAllCard}>
						<p>Select answer</p>
					</div>
					<Progress />
					<Card />
				</div>
			)}
		</div>
	)
}

export default GameScreen
