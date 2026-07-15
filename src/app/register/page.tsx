import type { NextPage } from "next";
import Link from 'next/link';

const Registrarse: NextPage = () => {
    return (
        <div>
            <div>
                <Link href="/login">
                    Return
                </Link>
            </div>
            <p>Test</p>
        </div>
    );
};

export default Registrarse;
