import LoadingSpinner from "@/components/LoadingSpinner";
import SettingsBadge from "@/components/SettingsBadge";
import { gql, useMutation, useQuery } from "@apollo/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useState } from "react";
import { IoAdd } from 'react-icons/io5';

type Props = {
}

const colorQuery = gql`
     query GetColors {
      getColors {
        color
        createdAt
        id
        updatedAt
      }
    }
`

const genderQuery = gql`
     query GetGenders {
      getGenders {
        gender
        createdAt
        id
        updatedAt
      }
    }
`

const categoryQuery = gql`
     query GetCategories {
      getCategories {
        category
        createdAt
        id
        updatedAt
      }
    }
`

const createColorMutation = gql`
mutation CreateColor($horseColorCreateInput: HorseColorCreateInput!) {
  createColor(HorseColorCreateInput: $horseColorCreateInput) {
    color
    createdAt
    id
    updatedAt
  }
}
`
const createGenderMutation = gql`
mutation CreateGender($horseGenderCreateInput: HorseGenderCreateInput!) {
  createGender(HorseGenderCreateInput: $horseGenderCreateInput) {
    gender
    createdAt
    id
    updatedAt
  }
}
`

const createCategoryMutation = gql`
mutation CreateCategory($horseCategoryCreateInput: HorseCategoryCreateInput!) {
  createCategory(HorseCategoryCreateInput: $horseCategoryCreateInput) {
    category
    createdAt
    id
    updatedAt
  }
}
`

const Settings: React.FC<Props> = () => {
  const [color, setColor] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const { data: colorData, loading: colorLoading, error: colorError } = useQuery(colorQuery);
  const { data: genderData, loading: genderLoading, error: genderError } = useQuery(genderQuery);
  const { data: categoryData, loading: categoryLoading, error: categoryError } = useQuery(categoryQuery);
  const [createColor] = useMutation(createColorMutation, {
    refetchQueries: [colorQuery]
  });
  const [createGender] = useMutation(createGenderMutation, {
    refetchQueries: [genderQuery]
  })
  const [createCategory] = useMutation(createCategoryMutation, {
    refetchQueries: [categoryQuery]
  })

  if (colorLoading || genderLoading || categoryLoading) {
    return (
      <LoadingSpinner />
    )
  }

  if (colorError || genderError || categoryError) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{JSON.stringify(colorError) || JSON.stringify(genderError) || JSON.stringify(categoryError)}</span>
        </div>
      </div>
    )
  }

  const handleCreateColor = async () => {
    const result = await createColor({
      variables: {
        horseColorCreateInput: {
          color
        }
      }
    });

    setColor('');
    console.log(result);
  }

  const handleCreateGender = async () => {
    const result = await createGender({
      variables: {
        horseGenderCreateInput: {
          gender
        }
      }
    })

    setGender('')
    console.log(result);
  }

  const handleCreateCategory = async () => {
    const result = await createCategory({
      variables: {
        horseCategoryCreateInput: {
          category
        }
      }
    })

    setCategory('');
    console.log(result);
  }

  return (
    <div className="p-4 flex flex-col gap-y-16">
      <div>
        <div className="flex flex-wrap gap-4 mb-4">
          {colorData.getColors.map((color: any, index: number) => {
            return <SettingsBadge type="Color" key={color.id} text={color.color} id={color.id} />
          })}
        </div>
        <div className="input-group">
          <input value={color} onChange={(e) => setColor(e.target.value)} type="text" placeholder="Color" className="input input-bordered w-full" />
          <button onClick={() => handleCreateColor()} className="btn btn-square">
            <IoAdd className="color-white" />
          </button>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap gap-4 mb-4">
          {genderData.getGenders.map((gender: any, index: number) => {
            return <SettingsBadge type="Gender" key={gender.id} text={gender.gender} id={gender.id} />
          })}
        </div>
        <div className="input-group">
          <input value={gender} onChange={(e) => setGender(e.target.value)} type="text" placeholder="Gender" className="input input-bordered w-full" />
          <button onClick={() => handleCreateGender()} className="btn btn-square">
            <IoAdd className="color-white" />
          </button>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap gap-4 mb-4">
          {categoryData.getCategories.map((category: any, index: number) => {
            return <SettingsBadge type="Category" key={category.id} text={category.category} id={category.id} />
          })}
        </div>
        <div className="input-group">
          <input value={category} onChange={(e) => setCategory(e.target.value)} type="text" placeholder="Category" className="input input-bordered w-full" />
          <button onClick={() => handleCreateCategory()} className="btn btn-square">
            <IoAdd className="color-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Settings
