import { redirect } from 'next/navigation'

const WOLFF_RUN_ID = 'a8c3cee6-12cc-419b-abdb-922a58a9bfbb'

export default function Page() {
  redirect(`/bewertung/${WOLFF_RUN_ID}`)
}
