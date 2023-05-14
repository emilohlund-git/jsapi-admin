import { gql, useMutation } from "@apollo/client";
import { GraphQLError } from "graphql";
import { useRef, useState } from "react";
import { Horse } from "./HorseList";

type Props = {
  horse: Horse;
}

const deleteHorseMutation = gql`
mutation DeleteHorse($horseWhereUniqueInput: HorseWhereUniqueInput!) {
  deleteHorse(HorseWhereUniqueInput: $horseWhereUniqueInput) {
    after
    birthyear
    category
    color
    createdAt
    gender
    id
    name
    nickname
    owner
    updatedAt
    images {
      createdAt
      id
      profile
      updatedAt
      url
    }
  }
}
`

const DeleteHorseModal: React.FC<Props> = ({ horse }) => {
  const closeModalRef = useRef<HTMLLabelElement>(null);
  const [deleteErrors, setDeleteErrors] = useState<{
    isError: boolean;
    error: GraphQLError[];
    exception?: any;
  }>({
    isError: false,
    error: []
  });

  const [loading, setLoading] = useState(false);

  const [deleteHorse] = useMutation(deleteHorseMutation);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/image/folder/${horse.name.replaceAll(" ", "")}`, {
        method: 'DELETE',
      }).then(async () => {
        const { data, errors } = await deleteHorse({
          variables: {
            horseWhereUniqueInput: {
              id: horse.id
            }
          },
          refetchQueries: ['GetHorses']
        })

        if (data && !errors && !loading) {
          closeModalRef?.current?.click();
        } else if (errors) {
          setDeleteErrors({
            isError: true,
            error: [...errors]
          })
        }
      });
    } catch (exception) {
      setDeleteErrors({
        isError: true,
        error: [],
        exception: exception
      })
    }
    setLoading(false);
  }

  const resetErrors = () => {
    setDeleteErrors({
      isError: false,
      error: [],
      exception: undefined
    })
  }

  return (
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box flex flex-col gap-4">
        <h3 className="font-bold text-lg">Are you sure you want to delete {horse.name}?</h3>
        {
          deleteErrors.isError ?
            <span className="text-error">
              {deleteErrors.error.length > 0 ? `⚠️ ${deleteErrors.error[0].message}` : (`⚠️ ${deleteErrors.exception.graphQLErrors[0].message}`)}
            </span>
            :
            <></>
        }
        <div className="modal-action">
          <label onClick={() => resetErrors()} ref={closeModalRef} htmlFor={"modal-" + horse.name} className="btn btn-error btn-outline">No!</label>
          <label onClick={() => handleDelete()} className={`btn btn-success btn-outline ${loading ? 'loading' : ''}`}>Yes!</label>
        </div>
      </div>
    </div>
  )
}

export default DeleteHorseModal