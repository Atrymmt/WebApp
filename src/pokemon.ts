import axios from 'axios';

// 定数とDOM要素の取得
const _baseURI = 'https://pokeapi.co/api/v2/pokemon/';
const _searchButton = document.querySelector('#search-btn')! as HTMLButtonElement;
const _pokeIdInput = document.querySelector('#poke-id')! as HTMLInputElement;
const _results = document.querySelector('#results')!;

// インターフェースの定義
interface PokemonData {
    name: string;                                       // 「名前」
    types: Array<{ type: { name: string } }>;           // 「タイプ」の配列
    abilities: Array<{ ability: { name: string } }>;    // 「特性」の配列
    moves: Array<{ move: { name: string } }>;           // 「技」の配列
    sprites: { front_default: string; };                // 「画像」
}

// ポケモンデータを取得する関数
async function getPokemonData(pokeId: string): Promise<PokemonData | null> {
    try {
        const response = await axios.get(`${_baseURI}${pokeId}`);  // PokeAPIからIDに対応したデータを取得
        return response.data;
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);      // 取得失敗した場合のエラー処理
        return null;
    }
}

// ポケモンデータを表示する関数
function displayPokemonData(data: PokemonData) {
    // 取得したデータから名前，タイプ，特性，技，画像を取得
    const name      = ` ${data.name}`;
    const types     = `Types: ${data.types.map((t) => t.type.name).join(', ')}`;
    const abilities = `Abilities: ${data.abilities.map((a) => a.ability.name).join(', ')}`;
    const moves     = `Moves: ${data.moves.slice(0, 5).map((m) => m.move.name).join(', ')}`; // 上位5つを表示
    const img = data.sprites.front_default
        ? `<img src="${data.sprites.front_default}" alt="${data.name}" />`
        : `<div>No image available</div>`;                                                   // 画像が無かったときのエラーメッセージ

    // HTMLの検索結果欄に表示
    _results.innerHTML = `
    <div class="result-item"><strong>${name}</strong></div>
    ${img}
    <div class="result-item"><strong>${types}</strong></div>
    <div class="result-item"><strong>${abilities}</strong></div>
    <div class="result-item"><strong>${moves}</strong></div>
  `;
}

// 検索ボタンを押した時の処理
_searchButton.addEventListener('click', async () => {
    const pokeId = _pokeIdInput.value.trim();
    // 検索欄に何も入力されなかったときの処理
    if (!pokeId) {
        _results.innerHTML = '<div class="error">Please enter a Pokemon ID</div>';  // エラーメッセージの出力
        return;
    }

    // ポケモンデータを取得
    const data = await getPokemonData(pokeId);
    if (data) {
        displayPokemonData(data);
    } else {
        _results.innerHTML = '<div class="error">Pokemon not found</div>';  // エラーメッセージの出力
    }
});
