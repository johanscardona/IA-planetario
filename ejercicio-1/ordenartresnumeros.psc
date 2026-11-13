Algoritmo ordenartresnumeros
	definir num1, num2, num3, aux Como Entero
	num1<- 2
	num2<- 7
	num3<- 5
	si num1 > num2 Entonces
		aux<- num1
		num1<- num2
		num2<- aux
	FinSi
	si num1 > num3 Entonces
		aux<- num1
		num1<- num3
		num3<- aux
	
	FinSi
	si num2 > num3 Entonces
		aux<- num2
		num2<- num3
		num3<- aux
		
	FinSi
	Escribir "numeros ordenados", num1, ",", num2, ",", num3
FinAlgoritmo
