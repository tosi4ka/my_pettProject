import React, { useState } from 'react'
import { Card } from '../Card/Card'
import { Progress } from '../Progress/Progress'
import { SettingsScreen } from '../SettingsScreen/SettingsScreen'
import { StartScreen } from '../StartScreen/StartScreen'
import style from './GameScreen.module.css'

const GameScreen: React.FC = () => {
	const [isGameStarted, setIsGameStarted] = useState(false)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)

	const handleStart = () => {
		setIsSettingsOpen(true)
	}

	const handleSettingsConfirm = () => {
		setIsSettingsOpen(false)
		setIsGameStarted(true)
	}

	const handleRestart = () => {
		setIsGameStarted(false)
		setIsSettingsOpen(true)
	}

	return (
		<div className={style.wrapTitle}>
			{!isGameStarted && !isSettingsOpen && (
				<StartScreen onStart={handleStart} />
			)}

			{isSettingsOpen && <SettingsScreen onConfirm={handleSettingsConfirm} />}

			{isGameStarted && (
				<div className={style.wrapCart}>
					<div className={style.titleAllCard}>
						<p>Select answer</p>
					</div>
					<Progress />
					<Card onRestart={handleRestart} />
				</div>
			)}
		</div>
	)
}

export default GameScreen
