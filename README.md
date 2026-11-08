# Calculadora de Notas UNIALFA

Simulador das notas N1, N2, N3 e N4 conforme a **Resolução UNIALFA nº 063/2023**
(sistema de avaliação dos cursos presenciais). Mostra a situação atual e quanto é
preciso tirar em cada etapa.

## Regras implementadas

| Etapa | Regra | Artigo |
| --- | --- | --- |
| N1 e N2 | `NF × 0,8 + NPRO × 0,2` | Art. 5º |
| Média N1/N2 | `≥ 8` aprovado · `< 3` reprovado · senão N3 obrigatória | Art. 6º e 7º |
| Média N1/N2/N3 | `≥ 5` aprovado · `< 3` reprovado · senão N4 | Art. 8º e 9º |
| Média final | `[(N1+N2+N3)/3 + N4] / 2 ≥ 5` | Art. 10 |
| Frequência | `< 75%` reprova independentemente das notas | Art. 20 |

O PDF da resolução fica em `src/assets/resolucao-063-2023.pdf` e pode ser
visualizado ou baixado pelo próprio app. Médias e notas exigidas usam o valor
exato, exibido com 2 casas decimais truncadas (sem arredondamento).

A lógica fica em `src/app/core/regras-avaliacao.ts` (funções puras, com testes em
`regras-avaliacao.spec.ts`).

## Desenvolvimento

```bash
npm install
npm start        # http://localhost:4200
npm run build
npm run test:ci  # testes em Chrome headless
```
