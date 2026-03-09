/* ================================================================
   BLOG MANAGER — CRUD completo para artículos del blog
================================================================ */
import db from './supabase-client.js';

const TABLE = 'blog_posts';

/** Obtiene todos los artículos ordenados por fecha */
export async function getPosts() {
  const { data, error } = await db
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/** Obtiene un artículo por ID */
export async function getPost(id) {
  const { data, error } = await db
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

/** Crea un nuevo artículo */
export async function createPost(post) {
  const { data, error } = await db
    .from(TABLE)
    .insert([{
      title:     post.title,
      excerpt:   post.excerpt,
      content:   post.content,
      category:  post.category,
      author:    post.author,
      published: post.published ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Actualiza un artículo existente */
export async function updatePost(id, post) {
  const { data, error } = await db
    .from(TABLE)
    .update({
      title:     post.title,
      excerpt:   post.excerpt,
      content:   post.content,
      category:  post.category,
      author:    post.author,
      published: post.published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Elimina un artículo */
export async function deletePost(id) {
  const { error } = await db
    .from(TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
}

/** Alterna el estado publicado/borrador */
export async function togglePublished(id, currentState) {
  return updatePost(id, { published: !currentState });
}
