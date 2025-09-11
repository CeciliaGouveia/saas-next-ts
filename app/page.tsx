import CompanionCard from "@/components/shared/companions/companion-card"
import CompanionsList from "@/components/shared/companions/companions-list"
import CTA from "@/components/shared/cta"
import { recentSessions } from "@/config/constants"
import {
  getAllCompanions,
  getRecentSession,
} from "@/lib/actions/companions.actions"
import { getSubjectColor } from "@/lib/utils"
import React from "react"

const Page = async () => {
  const companions = await getAllCompanions({ limit: 3 })
  const recentSessionsCompanions = await getRecentSession(10)

  return (
    <main>
      <h1 className="text-2xl underline">Popular Companions</h1>
      <section className="home-section">
        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}
      </section>

      <section className="home-section">
        <CompanionsList
          title="Recently completed sessions"
          companions={recentSessionsCompanions}
          classNames="w-2/3 max-lg:w-full"
        />
        <CTA />
      </section>
    </main>
  )
}

export default Page
