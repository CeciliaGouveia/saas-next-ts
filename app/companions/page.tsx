import CompanionCard from "@/components/shared/companions/companion-card"
import CompanionSearchInput from "@/components/shared/companions/companion-search-input"
import CompanionSubjectFilter from "@/components/shared/companions/companion-subject-filter"
import { getAllCompanions } from "@/lib/actions/companions.actions"
import { getSubjectColor } from "@/lib/utils"

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
  const filters = await searchParams
  const subject = filters.subject ? filters.subject : ""
  const topic = filters.topic ? filters.topic : ""

  const companions = await getAllCompanions({ subject, topic })

  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col">
        <h1>Companion Library</h1>
        <div className="flex gap-4">
          <CompanionSearchInput />
          <CompanionSubjectFilter />
        </div>
      </section>
      <section className="companions-grid">
        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}
      </section>
    </main>
  )
}

export default CompanionsLibrary
