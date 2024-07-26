import axios from 'axios';

// �萔��DOM�v�f�̎擾
const _baseURI = 'https://pokeapi.co/api/v2/pokemon/';
const _searchButton = document.querySelector('#search-btn')! as HTMLButtonElement;
const _pokeIdInput = document.querySelector('#poke-id')! as HTMLInputElement;
const _results = document.querySelector('#results')!;

// �C���^�[�t�F�[�X�̒�`
interface PokemonData {
    name: string;                                       // �u���O�v
    types: Array<{ type: { name: string } }>;           // �u�^�C�v�v�̔z��
    abilities: Array<{ ability: { name: string } }>;    // �u�����v�̔z��
    moves: Array<{ move: { name: string } }>;           // �u�Z�v�̔z��
    sprites: { front_default: string; };                // �u�摜�v
}

// �|�P�����f�[�^���擾����֐�
async function getPokemonData(pokeId: string): Promise<PokemonData | null> {
    try {
        const response = await axios.get(`${_baseURI}${pokeId}`);  // PokeAPI����ID�ɑΉ������f�[�^���擾
        return response.data;
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);      // �擾���s�����ꍇ�̃G���[����
        return null;
    }
}

// �|�P�����f�[�^��\������֐�
function displayPokemonData(data: PokemonData) {
    // �擾�����f�[�^���疼�O�C�^�C�v�C�����C�Z�C�摜���擾
    const name      = ` ${data.name}`;
    const types     = `Types: ${data.types.map((t) => t.type.name).join(', ')}`;
    const abilities = `Abilities: ${data.abilities.map((a) => a.ability.name).join(', ')}`;
    const moves     = `Moves: ${data.moves.slice(0, 5).map((m) => m.move.name).join(', ')}`; // ���5��\��
    const img = data.sprites.front_default
        ? `<img src="${data.sprites.front_default}" alt="${data.name}" />`
        : `<div>No image available</div>`;                                                   // �摜�����������Ƃ��̃G���[���b�Z�[�W

    // HTML�̌������ʗ��ɕ\��
    _results.innerHTML = `
    <div class="result-item"><strong>${name}</strong></div>
    ${img}
    <div class="result-item"><strong>${types}</strong></div>
    <div class="result-item"><strong>${abilities}</strong></div>
    <div class="result-item"><strong>${moves}</strong></div>
  `;
}

// �����{�^�������������̏���
_searchButton.addEventListener('click', async () => {
    const pokeId = _pokeIdInput.value.trim();
    // �������ɉ������͂���Ȃ������Ƃ��̏���
    if (!pokeId) {
        _results.innerHTML = '<div class="error">Please enter a Pokemon ID</div>';  // �G���[���b�Z�[�W�̏o��
        return;
    }

    // �|�P�����f�[�^���擾
    const data = await getPokemonData(pokeId);
    if (data) {
        displayPokemonData(data);
    } else {
        _results.innerHTML = '<div class="error">Pokemon not found</div>';  // �G���[���b�Z�[�W�̏o��
    }
});
