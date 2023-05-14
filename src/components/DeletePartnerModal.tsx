import { gql, useMutation } from "@apollo/client";
import { GraphQLError } from "graphql";
import { useRef, useState } from "react";
import { Partner } from "./PartnerList";

type Props = {
  partner: Partner;
}

const deletePartnerMutation = gql`
mutation Mutation($partnerWhereUniqueInput: PartnerWhereUniqueInput!) {
  deletePartner(PartnerWhereUniqueInput: $partnerWhereUniqueInput) {
    createdAt
    description
    id
    image {
      createdAt
      fileId
      id
      profile
      updatedAt
      url
    }
    name
    updatedAt
    website
  }
}
`

const DeletePartnerModal: React.FC<Props> = ({ partner }) => {
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

  const [deletePartner] = useMutation(deletePartnerMutation);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/image/folder/${partner.name.replaceAll(" ", "")}`, {
        method: 'DELETE',
      }).then(async () => {
        const { data, errors } = await deletePartner({
          variables: {
            partnerWhereUniqueInput: {
              id: partner.id
            }
          },
          refetchQueries: ['GetPartners']
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
        <h3 className="font-bold text-lg">Are you sure you want to delete {partner.name}?</h3>
        {
          deleteErrors.isError ?
            <span className="text-error">
              {deleteErrors.error.length > 0 ? `⚠️ ${deleteErrors.error[0].message}` : (`⚠️ ${deleteErrors.exception.graphQLErrors[0].message}`)}
            </span>
            :
            <></>
        }
        <div className="modal-action">
          <label onClick={() => resetErrors()} ref={closeModalRef} htmlFor={"modal-" + partner.name} className="btn btn-error btn-outline">No!</label>
          <label onClick={() => handleDelete()} className={`btn btn-success btn-outline ${loading ? 'loading' : ''}`}>Yes!</label>
        </div>
      </div>
    </div>
  )
}

export default DeletePartnerModal