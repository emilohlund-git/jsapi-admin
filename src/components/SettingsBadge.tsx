import { gql, useMutation } from "@apollo/client";

type Props = {
  text: string;
  id: string;
  type: 'Color' | 'Category' | 'Gender'
}

const deleteColorMutation = gql`
mutation DeleteColor($horseColorWhereUniqueInput: HorseColorWhereUniqueInput!) {
  deleteColor(HorseColorWhereUniqueInput: $horseColorWhereUniqueInput) {
    color
    createdAt
    id
    updatedAt
  }
}
`

const deleteGenderMutation = gql`
mutation DeleteGender($horseGenderWhereUniqueInput: HorseGenderWhereUniqueInput!) {
  deleteGender(HorseGenderWhereUniqueInput: $horseGenderWhereUniqueInput) {
    gender
    createdAt
    id
    updatedAt
  }
}
`

const deleteCategoryMutation = gql`
mutation DeleteCategory($horseCategoryWhereUniqueInput: HorseCategoryWhereUniqueInput!) {
  deleteCategory(HorseCategoryWhereUniqueInput: $horseCategoryWhereUniqueInput) {
    category
    createdAt
    id
    updatedAt
  }
}
`

const SettingsBadge: React.FC<Props> = ({ text, id, type }) => {
  const [deleteColor] = useMutation(deleteColorMutation, {
    refetchQueries: ['GetColors']
  })

  const [deleteGender] = useMutation(deleteGenderMutation, {
    refetchQueries: ['GetGenders']
  })

  const [deleteCategory] = useMutation(deleteCategoryMutation, {
    refetchQueries: ['GetCategories']
  })

  const handleDeleteColor = async () => {
    const result = await deleteColor({
      variables: {
        horseColorWhereUniqueInput: {
          id
        }
      }
    })

    console.log(result);
  }

  const handleDeleteGender = async () => {
    const result = await deleteGender({
      variables: {
        horseGenderWhereUniqueInput: {
          id
        }
      }
    })

    console.log(result);
  }

  const handleDeleteCategory = async () => {
    const result = await deleteCategory({
      variables: {
        horseCategoryWhereUniqueInput: {
          id
        }
      }
    })

    console.log(result);
  }

  return (
    <div className="w-fit h-8 bg-slate-600 px-4 flex items-center justify-center gap-x-3 rounded-lg">
      {type === 'Color' ?
        <svg onClick={() => handleDeleteColor()} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        : type === 'Category' ?
          <svg onClick={() => handleDeleteCategory()} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          : type === 'Gender' ?
            <svg onClick={() => handleDeleteGender()} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            : <></>
      }
      {text}
    </div>
  )
}

export default SettingsBadge