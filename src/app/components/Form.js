"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


export async function getLC(C1, id) {
    try {
        const res = await fetch(`${C1}${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        console.log("LC Data:", json);
        return json;
    }
    catch (err) {
        console.log(err);
    }
}

export async function getLC2(id) {
    try {
        const res = await fetch(`/api/leetcode?username=${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

export async function getLC3(id) {
    try {
        const res = await fetch(`/api/problem?id=${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

export async function getCC(C2, id) {
    try {
        const res = await fetch(`${C2}${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // if (!res.ok) {
        //     throw new Error(`HTTP error! status: ${res.status}`);
        // }

        const json = await res.json();
        console.log("CC Data:", json);
        return json;
    }
    catch (err) {
        console.log(err);
    }
}

// export async function getCF (id) {
//     try {
//         const res = await fetch(`${C5}${id}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         const json = await res.json();
//         console.log("CF Data:", json);
//         return json;
//     }
//     catch(err) {
//         console.log(err);
//     }
// }


export default function InputForm() {
    // const C1 = process.env.NEXT_PUBLIC_1C;
    // const C2 = process.env.NEXT_PUBLIC_2C;
    // const C3 = process.env.NEXT_PUBLIC_3C;
    // const C4 = process.env.NEXT_PUBLIC_4C;
    // const C5 = process.env.NEXT_PUBLIC_5C;

    const form = useForm({})

    async function onSubmit(data) {
        console.log(data);
        // const LC = await getLC(data.leetcode);
        // const CC = await getCC(data.codechef);
        // const CF = await getCF(data.codeforces);
        // console.log(LC);
        // console.log(CC);
        // console.log(CF);

        localStorage.setItem("leetcode", data.leetcode);
        localStorage.setItem("codechef", data.codechef);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="leetcode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>LeetCode</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="codechef"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CodeChef</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* <FormField
                        control={form.control}
                        name="codeforces"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CodeForces</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                </div>
                <div className="flex justify-center">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    );
};
