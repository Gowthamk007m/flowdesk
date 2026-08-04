import { useNavigate } from "react-router-dom";

import CaseForm from "@/features/cases/forms/CaseForm";
import { useCreateCase } from "@/features/cases/hooks/useCreateCase";

export default function CreateCasePage() {
    const navigate = useNavigate();

    const mutation = useCreateCase();

    return (
        <CaseForm
            isSubmitting={mutation.isPending}
            submitLabel="Create Case"
            onSubmit={(values) =>
                mutation.mutate(values, {
                    onSuccess: () => {
                        navigate("/cases");
                    },
                })
            }
        />
    );
}