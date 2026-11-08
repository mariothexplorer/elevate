import type { Quest } from '../types'
import { Icon } from './Icon'

type MyQuestsProps = {
  currentQuest: Quest | null
  completedQuests: Quest[]
}

export function MyQuests({ currentQuest, completedQuests }: MyQuestsProps) {
  return (
    <section className="my-quests-section" id="my-quests" aria-labelledby="my-quests-title">
      <div className="section-heading quests-heading">
        <div>
          <span className="eyebrow eyebrow-dark">YOUR ADVENTURE LOG</span>
          <h2 id="my-quests-title">Every great story <span>starts somewhere.</span></h2>
        </div>
        <span className="quest-count">{completedQuests.length} quests completed</span>
      </div>
      <div className="quest-log-grid">
        <article className="log-card current-log-card">
          <div className="log-card-heading">
            <span className="log-icon current-log-icon"><Icon name="compass" size={19} /></span>
            <span className="eyebrow eyebrow-dark">UP NEXT</span>
          </div>
          {currentQuest ? (
            <>
              <h3>{currentQuest.title}</h3>
              <p>{currentQuest.description}</p>
              <div className="log-card-bottom">
                <span className="log-category">{currentQuest.category}</span>
                <span className={`log-status ${currentQuest.status === 'in-progress' ? 'progress' : ''}`}>
                  <span /> {currentQuest.status === 'in-progress' ? 'In progress' : 'Ready when you are'}
                </span>
              </div>
            </>
          ) : (
            <div className="log-empty-current">
              <h3>Your next adventure is waiting.</h3>
              <p>Head back up and find a quest that feels right for today.</p>
              <a href="#home">Find a quest <Icon name="arrow-right" size={15} /></a>
            </div>
          )}
        </article>
        <article className="log-card completed-log-card">
          <div className="log-card-heading">
            <span className="log-icon completed-log-icon"><Icon name="check" size={18} /></span>
            <span className="eyebrow eyebrow-dark">LITTLE WINS</span>
          </div>
          {completedQuests.length > 0 ? (
            <ul className="completed-list">
              {completedQuests.map((quest) => (
                <li className="completed-item" key={`${quest.id}-${completedQuests.indexOf(quest)}`}>
                  <span className="completed-check"><Icon name="check" size={13} /></span>
                  <span className="completed-info">
                    <strong>{quest.title}</strong>
                    <span>{quest.category} <span className="list-separator">·</span> {quest.duration}</span>
                  </span>
                  <span className="completed-difficulty">{quest.difficulty}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-completed">
              <div className="empty-completed-art" aria-hidden="true">
                <span>✳</span><span>✳</span><span>✳</span>
              </div>
              <h3>Your story is just beginning.</h3>
              <p>Finish your first quest and it’ll find a home here. Go on, make a memory.</p>
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
