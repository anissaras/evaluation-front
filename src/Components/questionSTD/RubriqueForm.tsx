import React, {useEffect, useState } from "react";
import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
} from "@material-tailwind/react";
import {RubriqueService} from "../../services/RubriqueService";
import {Rubrique} from "../../model/Rubrique";
import AlertComp from "../../utils/alert";

type DialogWithFormProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isUpdate: boolean; // Nouvelle propriété pour indiquer si c'est une mise à jour
    initialData?: any; // Nouvelle propriété pour les données initiales
};

export function RubriqueForm({ open, setOpen ,isUpdate,initialData}: DialogWithFormProps) {
    const [designation, setDesignation] = useState("");
    const [alertMessage, setALertMessage] = useState<string | null>(null); // Variable d'état pour stocker le message d'erreur
    useEffect(() => {
        if (initialData) {
            console.log("hani pour update")
            setDesignation(initialData.designation);
        }
    }, [initialData]);
    const handleOpen = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleSubmit = async () => {
        try {
            // Création d'une nouvelle instance de la classe Rubrique avec les données du formulaire
            const newRubrique = new Rubrique(
                'RBS', // L'ID peut être 0 car il sera généré par le backend
                null, // Type (à remplir si nécessaire)
                designation, // noEnseignant (à remplir si nécessaire)
                null // Ordre (à remplir si nécessaire)
            );
            try {
                if(isUpdate) {
                    newRubrique.id = initialData?.id;
                    console.log("id upadte "+newRubrique.id);

                }
                const savedRubrique = isUpdate ? await new RubriqueService().update(newRubrique) : await new RubriqueService().create(newRubrique);
                //setSuccessMessage("L'etudiant est ajoutée avec Success");
                // Réinitialiser le formulaire après la soumission réussie
                // Réinitialisation de la valeur de la désignation après la soumission réussie
                setDesignation("");
                // Fermeture du dialogue après la soumission réussie
                handleOpen();
            } catch (error: any) {
                if (error.response && error.response.data && error.response.data.message) {
                    // Si le serveur a renvoyé un message d'erreur, le stocker dans la variable d'état
                    setALertMessage(error.response.data.message);
                    setShowSpinner(true);
                    setTimeout(() => {
                        setShowSpinner(false);
                    }, 5000); // 5000 milliseconds
                    console.log("testt")
                } else {
                    // Sinon, afficher un message d'erreur générique
                    //setErrorMessage('Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.');
                }
                // Afficher un message d'erreur à l'utilisateur ou prendre toute autre mesure appropriée
            }            // Appel de la méthode create de RubriqueService avec l'instance nouvellement créée


        } catch (error) {
            console.error("Erreur lors de la création de la rubrique :", error);
            // Gérer les erreurs de manière appropriée (affichage d'un message d'erreur, etc.)
        }
    };

    const [showSpinner, setShowSpinner] = useState(false);
    return (
        <>
            {/* Afficher l'alerte au-dessus de tout */}
            {showSpinner && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 100 // Assurez-vous que le z-index de l'alerte est supérieur à celui de la boîte de dialogue
                }}>
                    <AlertComp style={"red"} message={alertMessage} timeout={3000}/>
                </div>
            )}
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
                placeholder={undefined}
                style={{ zIndex: 10 }} // Assurez-vous que la boîte de dialogue a un z-index inférieur à celui de l'alerte
            >
                <Card className="mx-auto w-full max-w-[24rem]" placeholder={undefined}>
                    <CardBody className="flex flex-col gap-4" placeholder={undefined}>
                        <Typography variant="h4" color="blue-gray" placeholder={undefined}>
                            {isUpdate ? "Modifier une rubrique" : "Ajouter une rubrique"}
                        </Typography>
                        <Typography
                            className="mb-3 font-normal"
                            variant="paragraph"
                            color="gray"
                            placeholder={undefined}
                        >
                            Entrez le nom de la nouvelle rubrique.
                        </Typography>
                        <Typography className="-mb-2" variant="h6" placeholder={undefined}>
                            Désignation de la rubrique
                        </Typography>
                        <Input label="Désignation" size="lg" placeholder={undefined} value={designation}
                               onChange={(e) => setDesignation(e.target.value)} crossOrigin={undefined} />
                    </CardBody>
                    <CardFooter className="pt-0" placeholder={undefined}>
                        <Button variant="gradient" onClick={handleSubmit} fullWidth placeholder={undefined}
                                disabled={!designation || designation.length < 2}>
                            {isUpdate ? "Modifier" : "Ajouter"}
                        </Button>
                    </CardFooter>
                    <CardFooter className="pt-0" placeholder={undefined} style={{marginTop:'-3%'}}>
                        <Button variant="gradient" onClick={handleOpen} fullWidth placeholder={undefined}>
                            Annuler
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>

        </>
    );
}