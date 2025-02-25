"use client"

import { createContext, useContext, useState } from "react"

export interface Student {
  id: string
  name: string
  email: string
}

export interface Assessment {
  id: number
  title: string
  questions: number
}

export interface DashboardState {
  testsTaken: number
  students: Student[]
  activeStudents: number
  assessments: Assessment[]
}

const initialState: DashboardState = {
  testsTaken: 0,
  students: [
    { id: "1", name: "John Doe", email: "john.doe@example.com" },
    { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
  ],
  activeStudents: 2,
  assessments: [
    { id: 1, title: "Mathematics Quiz", questions: 10 },
    { id: 2, title: "Science Test", questions: 15 },
    { id: 3, title: "English Exam", questions: 20 },
  ],
}

const DashboardContext = createContext<
  | {
      state: DashboardState
      incrementTestsTaken: () => void
      addAssessment: (assessment: Assessment) => void
      addStudent: (student: Student) => void
    }
  | undefined
>(undefined)

export const useDashboardState = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboardState must be used within a DashboardProvider")
  }
  return context
}

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DashboardState>(initialState)

  const incrementTestsTaken = () => {
    setState((prev) => ({ ...prev, testsTaken: prev.testsTaken + 1 }))
  }

  const addAssessment = (assessment: Assessment) => {
    setState((prev) => ({ ...prev, assessments: [...prev.assessments, assessment] }))
  }

  const addStudent = (student: Student) => {
    setState((prev) => ({
      ...prev,
      students: [...prev.students, student],
      activeStudents: prev.activeStudents + 1,
    }))
  }

  return (
    <DashboardContext.Provider value={{ state, incrementTestsTaken, addAssessment, addStudent }}>
      {children}
    </DashboardContext.Provider>
  )
}

