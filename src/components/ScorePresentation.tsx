/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { motion } from 'framer-motion';

import { EventParticipant } from '../server/db';

import { getTotalGaf, getTotalGam } from '../helpers/utils';

type Props = {
    formData: EventParticipant & {
        participant: {
            first_name: string,
            last_name: string
        },
        notes: {
            salto_note: string,
            paralelas_note: string,
            viga_note: string,
            suelo_note: string,
            penalization: string,
            barra_fija_note: string,
            arzones_note: string,
            anillas_note: string
        }
    },
    gender: 'M' | 'F';
    onClose: any
}

export function ScorePresentation({ formData, gender, onClose }: Props) {

    useEffect(() => {
        const handleKeyPress = (event: { key: string; }) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [onClose]);

    return (
        <>
            <div className="fullscreen-container">
                <h3>{`${formData.participant.first_name} ${formData.participant.last_name}`}</h3>
                <div className='score-container'>
                    <motion.div
                        className="score-card"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Salto {formData.notes.salto_note}
                    </motion.div>
                    <motion.div
                        className="score-card"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Paralelas {formData.notes.paralelas_note}
                    </motion.div>
                    <motion.div
                        className="score-card"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Suelo {formData.notes.suelo_note}
                    </motion.div>
                    {gender === 'F' &&
                        <motion.div
                            className="score-card"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            Viga {formData.notes.viga_note}
                        </motion.div>
                    }
                    {gender === 'M' &&
                        <>
                            <motion.div
                                className="score-card"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                Barra fija {formData.notes.barra_fija_note}
                            </motion.div>
                            <motion.div
                                className="score-card"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                Arzones {formData.notes.arzones_note}
                            </motion.div>
                            <motion.div
                                className="score-card"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1 }}
                            >
                                Anillas {formData.notes.anillas_note}
                            </motion.div>
                        </>
                    }
                </div>
                <motion.div
                    className="score-card total-card"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: gender === 'M' ? 1.2 : 0.8 }}
                >
                    {gender === 'F' && `Total ${getTotalGaf(formData.notes)}`}
                    {gender === 'M' && `Total ${getTotalGam(formData.notes)}`}
                </motion.div>
            </div>
        </>
    );
}
