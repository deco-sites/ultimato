import { asset, Head } from "$fresh/runtime.ts";

function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Página não encontrada</title>
        <meta name="description" content="Página não encontrada" />
      </Head>
      <main>
        <div class="flex flex-col mx-auto lg:w-7/12 py-24">
          <p class="text-4xl font-bold text-primary uppercase text-center mb-4">
            Página não encontrada :(
          </p>
          <p class="text-2xl text-gray-700 text-center mb-6">
            O conteúdo que você procura não existe ou está desatualizado.
          </p>
          <div class="w-full text-center py-8">
            <img
              src={asset("/images/porquinho_não_encontrado.png")}
              width={300}
              alt="Não encontrado"
              class="mx-auto"
              loading="eager"
            />
          </div>
          <a
            class="mx-auto bg-primary rounded-lg text-white font-bold py-2 px-4"
            href="/"
          >
            Voltar para a página inicial
          </a>
        </div>
      </main>
    </>
  );
}

export default NotFoundPage;
