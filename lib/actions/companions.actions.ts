"use server"

import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "../supabase"

export const createCompanion = async (formData: CreateCompanion) => {
  const session = await auth()

  // criando a variável "author" fora do bloco de "if" para que possamos utilizá-la no "supabase.from().insert()"
  let author: string | null = null

  // utilizando um type guard para garantir que session existe e que existe a propriedade "userId" nela
  if (session && "userId" in session) {
    // caso a condição acima seja verdadeira, guardaremos o valor de "userId" na variável "author"
    author = session.userId

    // se a variável "author" for inválida, deve retornar uma resposta de não autorizdo
    if (!author) {
      return new Response("Não autorizado", { status: 401 })
    }
  }

  // criando um cliente do nosso DB, para que possamos fazer todas as operações no DB
  const supabase = createSupabaseClient()

  //
  const { data, error } = await supabase // pega a resposta a requisiçao do DB e faz atribuiçãop por desestruturação das propriedades "data" e "error"
    .from("companions") //seleciona a tabela no DB
    .insert({ ...formData, author }) // insere dados na tabela do DB
    .select() // retorna o registro inserido na tabela do DB

  if (error || !data) {
    throw new Error(error?.message || "Failed to create a companion")
  }

  return data[0]
}

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  // criando um cliente do nosso DB, para que possamos fazer todas as operações no DB
  const supabase = createSupabaseClient()

  let query = supabase.from("companions").select() //seleciona todos os registros da tabela

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`) //é um operador do PostgreSQL que signficia que ele é insensível para maiúsculas/minúsculas
      .or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`)
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`)
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`)
  }

  query = query.range((page - 1) * limit, page * limit - 1)

  const { data: companions, error } = await query

  if (error) throw new Error(error.message)

  return companions
}

export const getCompanion = async (id: string) => {
  // criando um cliente do nosso DB, para que possamos fazer todas as operações no DB
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("id", id)

  if (error) return console.log(error)

  return data[0]
}
