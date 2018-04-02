![](Assets/header.png)

## :question: About
This is a collection of skills I created whilst learning Alexa Skills development. The skills in this repository will mainly be written in Node.js and may contain some skills written in other languages at a later date.

## :page_facing_up: Instructions
In each of the skills in the Skills folder, there are two main components; the ``src`` folder and ``schema.json``
* ``src`` contains the source code for the [AWS Lambda function](https://aws.amazon.com/lambda/) for this skill
* ``schema.json`` is the [Interaction Model Schema](https://developer.amazon.com/docs/smapi/interaction-model-schema.html) for this skill

## :book: Skills
**Marcus Tressl** - Simple fact based skill that returns facts based on MATH20111 Real Analysis content.
```
You: Alexa, ask Marcus Tressl to give me some real analysis.

Alexa: Every non empty subset S of the reals which has an upper bound, has a least upper bound.
```

**TWD Quiz** - Trivia game with questions based on The Walking Dead TV series.
```
You: Alexa, open the walking dead game.

Alexa: Welcome to the walking dead quiz. I will ask you 5 questions, try to get as many right as you can.
       Just say the number of the answer. Let's begin.
       Question 1. Which one of these Sanctuary residents is not one of Negan’s wives?
       1. Frankie. 2. Sherry. 3. Laura.

You: Is it three?

Alexa: That answer is correct. Your score is 1.
       Question 2. Who fired the first shot at The Sanctuary in the Season 8 Premiere?
       1. Negan. 2. Rick. 3. Michonne.

You: One.

Alexa: That answer is wrong. The correct answer is 2: Rick. Your score is 1.
       Question 3. Andre was the son of which character?
       1. Michonne. 2. Abraham. 3. Morgan.
```

**Minecraft Helper** - Tells you the recipe for most items in Minecraft.
```
You: Alexa, open Minecraft helper.

Alexa: Welcome to the How To Helper. You can ask a question like, what's the recipe for a chest?
       Now, what can I help you with.
       
You: How do I make a furnace?

Alexa: A furnace can be crafted by placing cobblestone in every square but the middle square in a
       crafting table.
```
