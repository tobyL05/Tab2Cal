import { signInWithPopup, GoogleAuthProvider, OAuthCredential, signOut } from "firebase/auth";
import { auth, Collections, googleAuthProvider } from "../.secrets/firebase";
import { toast } from "../src/components/UI/Toast/Use-toast";
import { checkDocumentExists, getUser, addUser } from "./firestore";
import { UserDocument } from "../src/types/firestore";

const login = async (setUser: (user: UserDocument) => void, setCreds: (creds: OAuthCredential) => void): Promise<void> => {
    try{
        const signInResult = await signInWithPopup(auth, googleAuthProvider)
        const credential = GoogleAuthProvider.credentialFromResult(signInResult)
        if (credential) {
            const userExists = await checkDocumentExists(signInResult.user.uid, Collections.USERS)
            if (userExists) {
                // existing user
                setUser(await getUser(signInResult.user.uid) as UserDocument)
            } else if (userExists === undefined) {
                // error in checking whether user exists
                authError()
            } else {
                // new user
                const newUser = await addUser(signInResult.user)
                if (newUser) {
                    setUser(newUser) 
                    setCreds(credential)
                } else {
                    // new user wasn't added to firestore for some reason
                    throw Error()
                }
            }
        }
    } catch (error) {
        authError()
    }
}

const logout = async(): Promise<void> => {
    try {
        await signOut(auth)
        console.log("sign out successful")
        window.location.reload()
    } catch (error) {
        authError()
    }
}

// Error toast
const authError = (): void => {
    toast({
        title: "something went wrong",
        description: "please try again",
        className: "bg-red-500 text-white font-poppins"
    })
}

export { login, logout }